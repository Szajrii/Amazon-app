<template>
	<div class="my-form">
		<p>Zalogowany jako: {{getUserName}}</p>
		<button @click="createAlbum">create</button>
		<button @click="listItems">pokabierz liste</button>
	</div>

</template>

<script type="text/javascript">
	import router from '../router';
	import {IdentityPoolId, bucketRegion, bucketName, poolData, region} from '../utils/env.js'
	import AWS from 'aws-sdk'

	export default {
		name: 'main',
		props: ['cognito','s3'],
		data(){
			return{
				// s3: {},
				items: [],
				keyID: 0
			}
		},
		computed: {
			getUserName(){
				return this.cognito.getUsername();
			}
		},
		methods:{
			listItems(){

				this.s3.listObjects({}, (err, results) =>{
		        if(err){
		            return alert (err)
		        }
		        results.Contents.forEach( item => {
		        	this.items.push(item.Key)
		        })
			})
			},
			createAlbum(){
			
			   var params = {
			  Body: '1101101', 
			  Bucket: bucketName, 
			  Key: "binkowski/"
			 };
			   this.s3.putObject(params, function(err, data) {
			   if (err) console.log(err, err.stack); // an error occurred
			   else     console.log(data);           // successful response
			      // viewAlbum(albumName);
			    });
			  

			 //  var params = {Bucket: bucketName, Key: `uek-188345/mariusz2/mariusz2.txt`, Body: 'filedfsdfdfs'};

			 //  this.s3.upload(params, function(err, data) {
				//   console.log(err, data);
				// });
			},


		},
		created(){
			

		}
	};

</script>