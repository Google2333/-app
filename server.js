var express = require("express");
var fs = require("fs");
var server = express();
server.listen("8080",function(){
	console.log("8080")
})

server.use(express.static("./src"));
server.use(express.static("./node_modules"));

server.get("/category",function(request,response){
	fs.readFile("./mock/category.json",function(err,data){
		response.end(data);
	})
})

server.get("/list/:abc",function(request,response){
	//参数是由 前端发过来的，前端发给服务器的所有信息，request对象
	//参数：params
	var param = request.params.abc; //苹果
	fs.readFile("./mock/list.json",function(err,data){
		var ary = JSON.parse(data);
//		var result = [];
//		for(var i=0;i<ary.length;i++){
//			if(ary[i].category == param){
//				result.push(ary[i])
//			}
//		}
//		response.end(JSON.stringify(result))
		var result = ary.filter(function(item){
			//把所有满足条件的项都返回（以一个新的数组）
		   return item.category == param;
		})
		//send()是express的方法，
		//它和end()方法差不多的，但是可以发数组，对象
		//send方法会自动的把发的非字符串转成字符串
		response.send(result)
	})
})

server.get("/detail/:id",function(request,response){
	var id = request.params.id;
	console.log(id)
	fs.readFile("./mock/list.json",function(err,data){
		var ary = JSON.parse(data);
		//从ary这个数组中找到那一项id= id
		//数组方法 find(),循环整个数组，
		//从数组中返回符合条件的那一项
		//(不管数组中有多少项是符合条件的，只找到第
		//一条,即返回)
		var res = ary.find(function(item){
			return item.id == id;
		})
		response.send(res)
	})
})

server.post("/reg",function(request,response){
	//response.send("werty")
	//1把前端发过来的数据，取出来
	//过来的数据request里面，request是一个可读流
	var str = ""
	request.on("data",function(data){
		//参数data就是流一次读（64k）到的数据
		str += data;
	})
	request.on("end",function(err){
		//str就是读到的前端发来的数据
		//str是一个json字符串
		console.log(str)
		var obj = JSON.parse(str)
		//2.把取到的数据写到一个reg.json中
		fs.readFile("./mock/reg.json",function(err,data){
			var ary = JSON.parse(data);
			ary.push(obj);
			fs.writeFile("./mock/reg.json",JSON.stringify(ary),function(err){
				if(err){
					response.send(false)
				}else{
					console.log("写入成功");
					response.send(true)
				}
			})
		})
	})
	
})

server.post("/vaildate",function(request,response){
	//1把前端发过来的数据，取出来
	//2.reg.json读出来，比较一下，reg这个数组中
	//有没有一项的phone和，前端发过来的phone是一样的
	var str = ""
	request.on("data",function(data){
		str +=data;
	})
	request.on("end",function(err){
		console.log(str)
		var obj = JSON.parse(str);
		fs.readFile("./mock/reg.json",function(err,data){
			var ary = JSON.parse(data);
			var bool = true;
			for(var i=0;i<ary.length;i++){
				if(ary[i].phone == obj.phone){
					bool = false;
					response.send(false);
				}
			}
			if(bool){
				response.send(true);
			}
			
		})
	})
})


server.post("/login",function(request,response){
	//1.把前端发来的数据获取到
	var str = "";
	request.on("data",function(data){
		str += data;
	})
	request.on("end",function(err){
		console.log(str)//"{"phone":"111","pwd":"222"}"
		var obj = JSON.parse(str); //{phone:"111",pwd:"222"}
		//2.把reg.json中的数据都读出来，和前端发来的数据//进行比较，如果有这个数据，就算登录成功，
		fs.readFile("./mock/reg.json",function(err,data){
			var ary = JSON.parse(data);
			var bool = true;
			for(var i=0;i<ary.length;i++){
				if(ary[i].phone == obj.phone){
					bool = false;
					if(ary[i].pwd == obj.pwd){
						response.send(true)
					}else{
						response.send("密码错误")
					}
				}
			}
			if(bool){
				response.send("电话错误")
			}
		})
	})
	
})
