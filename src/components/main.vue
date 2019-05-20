<template>
	<div class="main-view">
		<div class="flex">
			<div class="col-2">
				<p>Zalogowany jako: {{getUserName}}</p>

				<input class="form-input" id="input-example-16" type="file" @change="getFile($event)">
				<button @click="uploadFile">Prześlij plik do bucketu</button>
				<button @click="listItems">pokabierz liste</button>

			</div>
			<div class="col-2">
				<ul>
					<li v-for="item in items">{{item}}</li>
				</ul>
				
			</div>
		</div>
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
				keyID: 0,
				file: '',
				pagesView: false,
				pages:{
					current: 1,
					all: 1
				}
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
	
		},
		watch:{
			items: function(){

			}
		},
		created(){
			

		}
	};

</script>