<template>
	<div class="main-view">
		<div class="line-separator-purple"></div>
		<div class="wrapper-user-info">
			<div class="container">
				<div class="row">
					<div class="col-12">
						<div class="wrapper-info">
							<div class="logo">
								<img src="../images/logo.png" alt="" height="30px">
							</div>
							<div class="user">
								<img src="../images/user.png" alt="" height="30px">
								<span>{{getUserName}}</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="wrapper-menu">
			<div class="container">
				<div class="row">
					<div class="col-12 col-md-8 mx-auto">
						<div class="wrapper-tabs">
							<div class="tab" @click="tabActive=1" :class="{ active: tabActive===1 }">
								<span>Twoje zdjęcia</span>
							</div>
							<div class="tab" @click="tabActive=2" :class="{ active: tabActive===2 }">
								<span>Twoje filmy</span>
							</div>
							<div class="tab" @click="tabActive=3" :class="{ active: tabActive===3 }">
								<span>Dodaj zdjęcie</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="container">
			<div class="row">
				<div class="col-12 col-md-6 mx-auto">
					<div class="wrapper-content">
						<div class="video last" v-show="tabActive===2">
							<label class="form-label" for="video">Twój ostatni film</label>
							<input type="text" id="video" value="www.pornhub.com/rafatus">
						</div>
						<div class="video upload" v-show="tabActive===3">
							<label class="form-label" for="video">Dodaj zdjęcie</label>
							<div class="custom-file">
								<input type="file" class="custom-file-input" id="customFileLang" lang="es" @change="getFile($event)">
								<label class="custom-file-label" for="customFileLang">{{file.name}}</label>
							</div>
							<button @click="uploadFile" class="btn-sec">Prześlij zdjęcie</button>
						</div>
						<div class="photo-container"  v-show="tabActive===1">
							<div class="video files">
								<label class="form-label" for="video">Twoje zdjęcia</label>
								<img src="../images/reload.png" alt="" height="20px" @click="listItems">
							</div>
							<div class="list-video">
								<div class="item" v-for="(item, index) in items">
									<div class="wrapper-img">
										<img :src="imagesSrc[index]"/>
										<p>{{item}}</p>
									</div>
									<div class="wrapper-add">
										<img src="../images/add.png" alt="" height="20px"  style="cursor: pointer" :id="index" @click="imageToAnimate($event)">
									</div>
								</div>
							</div>
							<div class="video files">
								<label class="form-label mt-5" for="video">Wybrane zdjęcia</label>
							</div>
							<button @click="serverRequest" class="btn btn-primary input-group-btn">server</button>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="flex">
			<div class="col-2">

				<!--<input class="form-input" id="input-example-16" type="file" @change="getFile($event)">-->
				<!--<button @click="uploadFile" class="btn btn-primary input-group-btn">Prześlij plik do bucketu</button>-->
				<!--<button @click="listItems" class="btn btn-primary input-group-btn">pobierz liste</button>-->

			</div>
			<div>
				<img :src="getImageId(index)" alt="" v-for="(img, index) in images" @click="removeImage($event)" :key="index">
			</div>
		</div>
	</div>

</template>

<script type="text/javascript">
	import router from '../router';
	import {IdentityPoolId, bucketRegion, bucketName, poolData, region} from '../utils/env.js'
	import AWS from 'aws-sdk'
	import axios from "axios";




	export default {
		name: 'main',
		props: ['cognito','s3', 'token'],
		data(){
			return{
				// s3: {},
				items: [],
				tabActive: 1,
				keyID: 0,
				file: '',
				images: [],
				imagesSrc: []
			}
		},
		computed: {
			getUserName(){
				return this.cognito.getUsername();
			},

		},
		methods:{

			listItems(){
			    console.log('elo');
				this.items = [];
				this.imagesSrc = [];

				this.s3.listObjects({Prefix: `${this.getUserName}/`}, (err, results) =>{
		        if(err){
		            return alert (err)
		        }
		        results.Contents.forEach( item => {
		        	this.items.push(item.Key)

					var params = {

						Bucket: 'uek-188345',
						Key: item.Key
					};

					var url = this.s3.getSignedUrl('getObject', params);
					this.imagesSrc.push(url)
		        	
		        })
		        
			});

			},

			uploadFile(){
			//dodac jesli wybierzesz pusty plik to nie przepusci
			 var params = {
				  Body: this.file, 
				  Bucket: bucketName, 
				  Key: `${this.getUserName}/${this.file.name}`
			 };

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

			},

			getImageId(arrayId){
				var id = this.items.indexOf(this.images[arrayId])
				return this.imagesSrc[id]
			},

			removeImage(event){
				this.images.splice(event.currentTarget.key, 1)
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