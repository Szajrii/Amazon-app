<template>
	<div class="form-group my-form">
	  <label class="form-label" for="input-example-1">Name</label>
	  <input class="form-input" type="text" id="input-example-1" placeholder="Name" v-model="name">
	  <label class="form-label" for="input-example-1">Password</label>
	  <input class="form-input" type="password" id="input-example-3" placeholder="Password" v-model="password">
	  <button class="btn btn-primary input-group-btn" @click="loginUser">Submit</button>
	  
	  
	  
	</div>
</template>

<script type="text/javascript">

import { AmazonCognitoIdentity, CognitoUser, AuthenticationDetails, CognitoUserPool } from 'amazon-cognito-identity-js';
import { LoginProviderName, poolData, IdentityPoolId, region, bucketName, bucketRegion } from '../utils/env.js';
import router from '../router';
import AWS from 'aws-sdk'
import { s3Bucket } from '../mixins/mixin.js'
	
	export default {
		name: "Login",
		data(){
			return{
				name: '',
				password: '',
				userPool: new CognitoUserPool(poolData),
				creds: new AWS.CognitoIdentityCredentials({
					    IdentityPoolId: IdentityPoolId,
					}),
				items: []
				
			}
		},
		mixins: [s3Bucket],
		methods:{
			loginUser(){

				AWS.config.update({
				  region: region,
				  credentials: new AWS.CognitoIdentityCredentials({
				    IdentityPoolId: IdentityPoolId
				  })
				});

				let authenticationDetails = new AuthenticationDetails({
		            Username : this.name,
		            Password : this.password
		        });
		        
		        let cognitoUser = new CognitoUser({
		            Username : this.name,
		            Pool : this.userPool
		        });
		        
		        cognitoUser.authenticateUser(authenticationDetails, {
		            onSuccess: (result) => {
		            	this.refreshCreds(result, cognitoUser);
		                
		            },
		        
		            onFailure: (err) => {
		                alert(err);
		            }
		        })


			},
		}
	};
</script>