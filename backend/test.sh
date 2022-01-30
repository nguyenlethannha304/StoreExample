if [ $1 == '' ]
then
    python manage.py test
else
    python manage.py test --tag=$1
fi