from django.shortcuts import render
from django.views import View

# Create your views here.


class AbstractBaseContext:
    def get_context_data(self, **kwargs):
        context = {**kwargs}
        return context


class HomePageView(AbstractBaseContext, View):
    template_name = 'core/home.html'

    def get(self, request, *args, **kwargs):
        return render(self.request, self.template_name, self.get_context_data())

    def get_context_data(self, **kwargs):
        return {**kwargs} if kwargs else {}


home_page_view = HomePageView.as_view()
