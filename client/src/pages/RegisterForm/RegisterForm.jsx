import React from 'react'
import './RegisterForm.css'
function RegisterForm() {
  return (
    <div class="main">

        <section class="signup">
            <div class="container">
                <div class="signup-content">
                    <div class="signup-form">
                        <h2 class="form-title">REGISTER</h2>
                        <form method="POST" class="register-form" id="register-form">
                            <div class="form-group">
                                <label for="name"><i class="zmdi zmdi-account material-icons-name"></i></label>
                                <input type="text" name="name" id="name" placeholder="Your Name"/>
                            </div>
                            <div class="form-group">
                                <label for="email"><i class="zmdi zmdi-email"></i></label>
                                <input type="email" name="email" id="email" placeholder="Your Email"/>
                            </div>
                            <div class="form-group">
                                <label for="phone"><i class="zmdi zmdi-phone"></i></label>
                                <input type="tel" name="phone" id="phone no" placeholder="Your Phone No"/>
                            </div>
                            <div class="form-group">
                                <label for="gender"><i class="zmdi zmdi-male-female"></i></label>
                                <input type="text" name="gender" id="gender" placeholder="Your Gender (Male/Female/Other)"/>
                            </div>
                            <div class="form-group">
                                <label for="age"><i class="zmdi zmdi-calendar"></i></label>
                                <input type="number" name="age" id="age" placeholder="Your Age"/>
                            </div>
                            <div class="form-group">
                                <label for="password"><i class="zmdi zmdi-lock"></i></label>
                                <input type="password" name="password" id="pass" placeholder="Password"/>
                            </div>
                            <div class="form-group">
                                <label for="password2"><i class="zmdi zmdi-lock-outline"></i></label>
                                <input type="password" name="password2" id="re_pass" placeholder="Repeat your password"/>
                            </div>
                            <div class="form-group form-button">
                                <input type="submit" name="signup" id="signup" class="form-submit" value="Register"/>
                            </div>
                        </form>
                    </div>
                    <div class="signup-image">
                        <figure><img src="assets/form/formregisterlogin/images/signup-image.jpg" alt="sign up image"/></figure>
                        <a href="/login" class="signup-image-link">I am already member</a>
                    </div>
                </div>
            </div>
        </section>

    </div>
  )
}

export default RegisterForm
