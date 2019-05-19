<template>	


		<div>	

			<div class="form-group my-form">
			  <label class="form-label" for="input-example-1">Name</label>
			  <input class="form-input" type="text" id="input-example-1" placeholder="Name" v-model="name">
			  <label class="form-label" for="input-example-1">Email</label>
			  <input class="form-input" type="text" id="input-example-2" placeholder="Email" v-model="email">
			  <label class="form-label" for="input-example-1">Password</label>
			  <input class="form-input" type="password" id="input-example-3" placeholder="Password" v-model="password">
			  <button class="btn btn-primary input-group-btn" @click="registerUser">Submit</button>
			  <router-link to="/login"><span>Masz już konto? Zaloguj się!</span></router-link>
			  
			</div>

		</div>

</template>

<script type="">

import { AuthenticationDetails, CognitoUser, CognitoUserAttribute, CognitoUserPool } from 'amazon-cognito-identity-js';
import { LoginProviderName, poolData } from '../utils/env.js';
import router from '../router';

	export default {
		name: 'Register',
		data(){
			return{
				name: '',
				email: '',
				password: '',
				userPool: new CognitoUserPool(poolData),
				cognitoUser: ''
			}
		},
		methods:{
			registerUser(){
				
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
					 null, (err, result) =>{
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

<style >
	
	
</style>