import { LoginProviderName, poolData, IdentityPoolId, region, bucketName, bucketRegion } from '../utils/env.js';
import router from '../router';
import { CognitoRefreshToken } from 'amazon-cognito-identity-js';

export const s3Bucket = {
	data(){
		return{
			s3: {}
		}
	},
	methods:{
		refreshCreds(result, cognitoUser){
			var accessToken = result.getAccessToken().getJwtToken();
			// var idToken = result.idToken.jwtToken;
			var idToken = result.getIdToken().getJwtToken();

			var refreshToken = result.getRefreshToken().getToken();
			var refreshTokenInstance = new CognitoRefreshToken({ RefreshToken: refreshToken })
		        //POTENTIAL: Region needs to be set if not already set previously elsewhere.
			console.log(refreshTokenInstance)




		        AWS.config.region = 'eu-west-1';



				cognitoUser.refreshSession(refreshTokenInstance, (err, session) => {
					if(err){}
						else{
						idToken = result.getIdToken().getJwtToken();
						console.log(session)

					}
				});


				AWS.config.credentials = new AWS.CognitoIdentityCredentials({
					IdentityPoolId : IdentityPoolId, // your identity pool id here
					Logins : {
						// Change the key below according to the specific region your user pool is in.
						'cognito-idp.eu-west-1.amazonaws.com/eu-west-1_BuFvMskGo' : result.getIdToken().getJwtToken()
					}
				});


			//refreshes credentials using AWS.CognitoIdentity.getCredentialsForIdentity()
			// if (AWS.config.credentials.needsRefresh()) {
			// 	cognitoUser.refreshSession(refreshToken, (err, session) => {
			//
			// 	})
			// }
		        AWS.config.credentials.refresh((error) => {
		            if (error) {
		                 console.error(error);

		            } else {
		                 // Instantiate aws sdk service objects now that the credentials have been updated.
						idToken = result.getIdToken().getJwtToken();
		                 // example: var s3 = new AWS.S3();
		                 this.s3 = new AWS.S3({
						  apiVersion: '2006-03-01',
						  params: {Bucket: bucketName},
						  region: bucketRegion
						});

		                 console.log('Successfully logged!');
		                 router.push({name: 'main', params: {'cognito': cognitoUser, 's3': this.s3, token: idToken }})

		            }
		        });
		}
	}
};