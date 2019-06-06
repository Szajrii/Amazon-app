<template>
	<div class="main-view">
		<div class="flex">
			<div class="col-2">
				<p>Zalogowany jako: {{getUserName}}</p>

				<input class="form-input" id="input-example-16" type="file" @change="getFile($event)">
				<button @click="uploadFile" class="btn btn-primary input-group-btn">Prześlij plik do bucketu</button>
				<button @click="listItems" class="btn btn-primary input-group-btn">pobierz liste</button>
				<button @click="serverRequest" class="btn btn-primary input-group-btn">server</button>

			</div>
			<div class="col-2">
				<ul>
					<li v-for="(item, index) in items" :id="index" @click="imageToAnimate($event)">{{item}}</li>
				</ul>
				
			</div>
		</div>
	</div>

</template>

<script type="text/javascript">
	import router from '../router';
	import {IdentityPoolId, bucketRegion, bucketName, poolData, region} from '../utils/env.js'
	import AWS from 'aws-sdk'
	import axios from "axios";

	// var ffmpeg = require('fluent-ffmpeg');



	export default {
		name: 'main',
		props: ['cognito','s3', 'token'],
		data(){
			return{
				// s3: {},
				items: [],
				keyID: 0,
				file: '',
				images: []
			}
		},
		computed: {
			getUserName(){
				return this.cognito.getUsername();
			}
		},
		methods:{

			listItems(){
			    console.log('elo');
				this.items = [];
				this.pagesView = true;

				this.s3.listObjects({Prefix: `${this.getUserName}/`}, (err, results) =>{
		        if(err){
		            return alert (err)
		        }
		        results.Contents.forEach( item => {
		        	this.items.push(item.Key)
		        	
		        })
		        
			})
			},

			uploadFile(){
			//dodac jesli wybierzesz pusty plik to nie przepusci
			 var params = {
				  Body: this.file, 
				  Bucket: bucketName, 
				  Key: `${this.getUserName}/${this.file.name}`
			 };
			   // this.s3.putObject(params, function(err, data) {
				  //  if (err) console.log(err, err.stack); // an error occurred
				  //  else     console.log(data);           // successful response
				     
			   //  });
			  
			 //  var params = {Bucket: bucketName, Key: `uek-188345/mariusz2/mariusz2.txt`, Body: 'filedfsdfdfs'};

			  this.s3.upload(params, function(err, data) {
				  console.log(err, data);
				});
			  this.items.push(`${this.getUserName}/${this.file.name}`);
			},

			getFile(file){
				this.file = file.target.files[0];
			},
			serverRequest(){
				axios.post('https://fkcs76z2le.execute-api.eu-central-1.amazonaws.com/dev/animation',{
					"token": this.token,
					"name": this.getUserName,
					"images": this.images
				}).then(({data}) => {
					console.log(data)
				});
			},
			imageToAnimate(event){
				this.images.push(this.items[event.currentTarget.id])
			}
	
		},
		watch:{
			items: function(){

			}
		},
		created(){
			

		}
	};

</script>

<style scoped>
	li{
		cursor: pointer;
	}
</style>