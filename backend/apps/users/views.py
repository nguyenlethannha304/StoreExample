from django.contrib.auth import login, logout
from django.contrib.auth.decorators import login_required
from django.core.exceptions import ImproperlyConfigured
from django.http.response import HttpResponseRedirect
from django.shortcuts import redirect, render
from django.urls.base import reverse
from django.utils.decorators import method_decorator
from django.views.decorators.cache import never_cache
from django.views.decorators.csrf import csrf_protect
from django.views.decorators.debug import sensitive_post_parameters
from django.views import View
from django.contrib import messages
from django.conf import settings
from apps.core.views import AbstractBaseContext
from django.http.response import JsonResponse
from .forms import *
from .forms import UserModel
from ..utils.tools import validate_email

dispatch_decorators = [sensitive_post_parameters(), csrf_protect, never_cache]


@method_decorator(dispatch_decorators, name='dispatch')
class AbstractUserView(AbstractBaseContext, View):
    redirect_url = None
    redirect_field_name = None
    template_name = None
    form = None

    def get_success_url(self):
        if self.redirect_url is not None:
            return self.redirect_url
        redirect_to = self.request.GET.get(
            self.redirect_field_name, settings.REDIRECT_TO_HOMEPAGE
        )
        return redirect_to

    def get_form(self):
        return self.form(**self.get_form_kwargs())

    def form_valid(self, form):
        raise ImproperlyConfigured(
            "form_valid() must be defined in subclass=%s" % self.__class__)

    def form_invalid(self, form=None):
        return render(self.request, self.template_name, self.get_context_data(form=form))

    def get_context_data(self, **kwargs):
        if 'form' not in kwargs:
            kwargs['form'] = self.get_form()
        return super().get_context_data(**kwargs)

    def get(self, request, *args, **kwargs):
        return render(self.request, self.template_name, self.get_context_data())

    def post(self, request, *args, **kwargs):
        form = self.get_form()
        if form.is_valid():
            return self.form_valid(form)
        else:
            return self.form_invalid(form)

    def get_form_kwargs(self, **kwargs):
        kwargs = kwargs if kwargs else {}
        if self.request.method == "POST":
            kwargs['data'] = self.request.POST
        return kwargs


class LoginView(AbstractUserView):
    redirect_field_name = 'next'
    template_name = 'users/login.html'
    form = AuthenticationForm

    def get_form_kwargs(self):
        kwargs = {}
        kwargs['request'] = self.request
        return super().get_form_kwargs(**kwargs)

    def form_valid(self, form):
        login(self.request, form.get_user())
        return HttpResponseRedirect(self.get_success_url())

    def get(self, request, *args, **kwargs):
        if self.request.user.is_authenticated:
            return HttpResponseRedirect(self.get_success_url())
        return super().get(request, *args, **kwargs)


login_view = LoginView.as_view()


class UserCreationView(AbstractUserView):
    redirect_url = None
    template_name = 'users/register.html'
    form = UserCreationForm

    def setup(self, request, *args, **kwargs):
        super().setup(request, *args, **kwargs)
        self.redirect_url = reverse('users:login')

    def form_valid(self, form):
        form.save()
        messages.success(
            self.request, 'Your registration is success,\nyou can login now.')
        return HttpResponseRedirect(self.get_success_url())

    def get(self, request, *args, **kwargs):
        if self.request.user.is_authenticated:
            logout(request)
        return super().get(request, *args, **kwargs)


user_create_view = UserCreationView.as_view()


@method_decorator(login_required, name='dispatch')
class PasswordChangeView(AbstractUserView):
    redirect_url = None
    template_name = 'users/change_password.html'
    form = PasswordChangeForm

    def setup(self, request, *args, **kwargs):
        super().setup(request, *args, **kwargs)
        self.redirect_url = reverse('users:login')

    def get_form_kwargs(self):
        kwargs = {}
        kwargs['user'] = self.request.user
        return super().get_form_kwargs(**kwargs)

    def form_valid(self, form):
        form.save()
        messages.success(
            self.request, "Your password is changed\nPlease login again")
        if self.request.user.is_authenticated:
            logout(self.request)
        return HttpResponseRedirect(self.get_success_url())


password_change_view = PasswordChangeView.as_view()


@method_decorator(login_required, name='dispatch')
class ProfileChangeView(AbstractUserView):
    form = ProfileChangeForm
    template_name = 'users/profile.html'
    redirect_url = None

    def setup(self, request, *args, **kwargs):
        super().setup(request, *args, **kwargs)
        self.redirect_url = request.path

    def get_form_kwargs(self):
        kwargs = {}
        kwargs['user'] = self.request.user
        return super().get_form_kwargs(**kwargs)

    def form_valid(self, form):
        form.save()
        messages.success(self.request, 'Your profile is changed')
        return HttpResponseRedirect(self.get_success_url())


profile_change_view = ProfileChangeView.as_view()


class LogoutView(View):
    redirect_url = settings.REDIRECT_TO_HOMEPAGE

    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        logout(request)
        return super().dispatch(request, *args, **kwargs)

    def get(self, request, *args, **kwargs):
        return HttpResponseRedirect(self.get_success_url())

    def post(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    def get_success_url(self):
        return self.redirect_url


logout_view = LogoutView.as_view()


def check_email_exists(request):
    email_value = request.GET.get('email')
    if validate_email(email_value):
        email_exist = UserModel.objects.filter(email=email_value).exists()
        return JsonResponse({'exists': email_exist})
    return JsonResponse({'exists': True})
