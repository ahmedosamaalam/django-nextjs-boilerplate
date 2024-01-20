<!--  ENV_PATH=.env.production poetry run python manage.py runserver -->

<!-- djangorestframework-api-key  need to explore this package for api keys-->




<!-- Why login on backend -->
 - can verify username, get email from username and request to login

 return {
    access_token,refresh_token,userData
 }


<!-- Why login in frontend -->
before login with firebase, check either username exist of not(send email to backend, BE will give email)
Easy refresh token
direct contact with fireabse
