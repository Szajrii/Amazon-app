<template>	

			<div class="wrapper-bg">
				<div id="register">
					<div class="wrapper-logo">
						<img src="../images/logo.png" alt="">
						<p>WIPWC</p>
					</div>
					<div class="form-group">
						<h3>Potwierdź rejestracje</h3>
						<div class="input-wrapper">
							<label class="form-label" for="input-example-1">Twój kod weryfikacyjny</label>
							<input class="form-input" type="text" id="input-example-1" placeholder="Twój kod" v-model="confirmationCode">
						</div>
						<div class="wrapper-button">
							<button class="btn btn-gajda" @click="confirmUser">Potwierdź kod</button>
						</div>
						<div class="wrapper-szarek">
							<router-link to="/login"><span>Masz już konto? Zaloguj się!</span></router-link>
						</div>
					</div>
				</div>
			</div>

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