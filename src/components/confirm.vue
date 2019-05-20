<template>	

		<div class="my-form">
			<label class="form-label" for="input-example-1">Type your confirmation code</label>
			<input class="form-input" type="text" id="input-example-1" placeholder="Name" v-model="confirmationCode">
			<button class="btn btn-primary input-group-btn" @click="confirmUser">Submit</button>

		</div>

</template>

<script type="">
	import { AuthenticationDetails, CognitoUser, CognitoUserAttribute, CognitoUserPool } from 'amazon-cognito-identity-js';
	import router from '../router';




	export default{
		name: 'confirm',
		data(){
			return{
				confirmationCode: '',
				cognitoUser: {}
			}
		},
		props: ["cognito"],
		methods:{

			confirmUser(){
				this.cognitoUser.confirmRegistration(this.confirmationCode, true, (err, result)=> {
				    if (err) {
				        alert(err);
				        return;
				    }
				    
				    console.log('call result: ' + result);
				});
			},

			setCognito(){
				this.cognitoUser = this.cognito;
			}
		},
		
		created(){
			this.setCognito();
		}
	};

</script>