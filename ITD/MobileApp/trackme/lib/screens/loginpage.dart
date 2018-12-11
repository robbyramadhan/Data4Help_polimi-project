import 'package:flutter/material.dart';
import 'package:track_me/screens/feed.dart';
import 'package:track_me/styles/colors.dart';

import 'PageNavigator.dart';

class LoginPage extends StatefulWidget {
  static String tag = 'login-page';
  @override
  _LoginPageState createState() => new _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  @override
  Widget build(BuildContext context) {
    final logo = Hero(
      tag: 'hero',
      child: CircleAvatar(
        backgroundColor: Colors.transparent,
        radius: 48,
        child: Image.asset('assets/icons/logo.png'),
      ),
    );

    final email = TextFormField(
      keyboardType: TextInputType.emailAddress,
      autofocus: false,
      initialValue: null,
      decoration: InputDecoration(

          hintText: 'EMAIL',
          contentPadding: EdgeInsets.fromLTRB(20.0, 10.0, 20.0, 10.0),
          border: UnderlineInputBorder()),
    );

    final password = TextFormField(
      autofocus: false,
      initialValue: null,
      obscureText: true,
      decoration: InputDecoration(
          hintText: 'PASSWORD',
          contentPadding: EdgeInsets.fromLTRB(20.0, 10.0, 20.0, 10.0),
          border: UnderlineInputBorder()),
    );

    final loginButton = Container(
        height: 40,
        child: Material(
          borderRadius: BorderRadius.circular(20),
          shadowColor: Colors.green,
          color: colorStyles['button_green'],
          elevation: 7.0,
          child: FlatButton(
            color: Colors.transparent,
            onPressed: () {
              Navigator.of(context).pushNamed(PageNavigator.tag);
            },
            child: Center(
              child: Text(
                'LOGIN',
                style: TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                    fontFamily: 'Roboto'),
              ),
            ),
          ),
        ));

    final registrationButton = Container(
        height: 40,
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            Text('new to trackMe ? ',
              style: TextStyle(
                color: colorStyles['text_color'],
                fontFamily: 'Roboto',
                fontWeight: FontWeight.w700
              ) ,
            ),
            Material(
              borderRadius: BorderRadius.circular(20),

              color: Colors.transparent,
              elevation: 0,

              child: FlatButton(

                splashColor: Colors.transparent,
                highlightColor: Colors.transparent,
                onPressed: () {
                  print('pressed');
                },
                child: Center(
                  child: Text(
                    'REGISTER',
                    style: TextStyle(
                        color: colorStyles['primary_pink'],
                        fontWeight: FontWeight.bold,
                        fontFamily: 'Roboto'),
                  ),
                ),
              ),
            )
          ],
        )
    );

    final forgotLabel = FlatButton(
      splashColor: Colors.transparent,
      highlightColor: Colors.transparent,
      child: Text(
        'Forgot Password',
        style: TextStyle(
          color: colorStyles['button_green'],
          fontWeight: FontWeight.bold,
          fontSize: 14.0

        ),
      ),
      onPressed: () {},
    );

    return Scaffold(
      backgroundColor: Colors.white,
      body: Center(
        child: ListView(
          shrinkWrap: true,
          padding: EdgeInsets.only(left: 24.0, right: 24),
          children: <Widget>[
            logo,
            SizedBox(height: 48.0),
            email,
            SizedBox(height: 8),
            password,
            Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: <Widget>[
                forgotLabel,
              ],
            ),
            SizedBox(height: 48.0),
            loginButton,
            SizedBox(height: 16.0),
            registrationButton,

          ],
        ),
      ),
    );
  }
}
