<template>
    <div class="wrapper-bg">
        <div id="register">
            <div class="wrapper-logo">
                <img src="../images/logo.png" alt="">
                <p>WIPWC</p>
            </div>
            <div class="form-group">
                <h3>Rejestracja</h3>
                <div class="input-wrapper">
                    <label class="form-label" for="input-example-1">Name</label>
                    <input class="form-input" type="text" id="input-example-1" placeholder="Name" v-model="name">
                </div>
                <div class="input-wrapper">
                    <label class="form-label" for="input-example-1">Email</label>
                    <input class="form-input" type="text" id="input-example-2" placeholder="Email" v-model="email">
                </div>
                <div class="input-wrapper">
                    <label class="form-label" for="input-example-1">Password</label>
                    <input class="form-input" type="password" id="input-example-3" placeholder="Password"
                           v-model="password">
                </div>
                <div class="wrapper-button">
                    <button class="btn btn-gajda" @click="registerUser">Zarejestruj się</button>
                </div>
                <div class="wrapper-szarek">
                    <router-link to="/login"><span>Masz już konto? Zaloguj się!</span></router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script type="">

    import {
        AuthenticationDetails,
        CognitoUser,
        CognitoUserAttribute,
        CognitoUserPool
    } from 'amazon-cognito-identity-js';
    import {LoginProviderName, poolData} from '../utils/env.js';
    import router from '../router';

    export default {
        name: 'Register',
        data() {
            return {
                name: '',
                email: '',
                password: '',
                userPool: new CognitoUserPool(poolData),
                cognitoUser: ''
            }
        },
        methods: {
            registerUser() {

                this.userPool.signUp(this.name, this.password,
                    [
                        new CognitoUserAttribute({
                            Name: 'email',
                            Value: this.email
                        }),
                        new CognitoUserAttribute({
                            Name: 'name',
                            Value: this.name
                        })

                    ],
                    null, (err, result) => {
                        if (err) {
                            alert(err);
                            return;
                        }
                        this.cognitoUser = result.user;
                        console.log('user name is ' + this.cognitoUser.getUsername());
                        // this.$emit("cognito", this.cognitoUser);
                        router.push({name: `confirm`, params: {'cognito': this.cognitoUser}})
                    });

            }
        }
    };

</script>
