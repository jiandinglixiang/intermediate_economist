
exports.main = async function(event) {

	let body = event.body
	if (event.isBase64Encoded) {
		body = Buffer.from(body, 'base64')
	}
	const {
		access_token,
		openid,
		appid
	} = JSON.parse(body)
	let res ={}
	try{
		 res = await uniCloud.getPhoneNumber({
			provider: 'univerify',
			appid: appid, // DCloud appid
			apiKey: '588badfa93630d75b522ab3f757f2798', // 在开发者中心开通服务并获取apiKey
			apiSecret: '3de31c7b8e8acfb8050ad637ec7c04e4', // 在开发者中心开通服务并获取apiSecret
			access_token: access_token,
			openid: openid
		})
		
	}catch(e){
		//TODO handle the exception
		return {
			code: 0,
			message: '获取手机号失败',
			body: JSON.stringify(e)
		}
	}
	// console.log(event, 798)
	// event为客户端上传的参数
	// const res = await uniCloud.getPhoneNumber({
	// 	appid: "__UNI__107ED5C", // 客户端callFunction时携带的AppId信息
	// 	provider: 'univerify',
	// 	apiKey: '13471d041a8227e59937268c38c5fd60', // 在开发者中心开通服务并获取apiKey
	// 	apiSecret: '3e21533e9cb8eaacd109974cafce286b', // 在开发者中心开通服务并获取apiSecret
	// 	access_token: event.access_token,
	// 	openid: event.openid
	// })

	// 执行用户信息入库等操作，正常情况下不要把完整手机号返回给前端
	// 如果数据库在uniCloud上，可以直接入库
	// 如果数据库不在uniCloud上，可以通过 uniCloud.httpclient API，将手机号通过http方式传递给其他服务器的接口，详见：https://uniapp.dcloud.net.cn/uniCloud/cf-functions?id=httpclient
	//返回数据给客户端
	return {
		code: 0,
		message: '获取手机号成功',
		data: res,
		body: JSON.parse(body)
	}
}



// 'use strict';
// exports.main = async (event, context) => {
//   // event里包含着客户端提交的参数
//   const res = await uniCloud.getPhoneNumber({
//   	appid: '__UNI__BECBFAE', // 替换成自己开通一键登录的应用的DCloud appid
//   	provider: 'univerify',
//   	apiKey: '588badfa93630d75b522ab3f757f2798', // 在开发者中心开通服务并获取apiKey
//   	apiSecret: '3de31c7b8e8acfb8050ad637ec7c04e4', // 在开发者中心开通服务并获取apiSecret
//   	access_token: event.access_token,
//   	openid: event.openid
//   })
  
//   console.log(res); // res里包含手机号
//   // 执行用户信息入库等操作，正常情况下不要把完整手机号返回给前端
//   // 如果数据库在uniCloud上，可以直接入库
//   // 如果数据库不在uniCloud上，可以通过 uniCloud.httpclient API，将手机号通过http方式传递给其他服务器的接口，详见：https://uniapp.dcloud.net.cn/uniCloud/cf-functions?id=httpclient
//   return {
//     code: 0,
//     message: '获取手机号成功',
// 	data: res,
// 	event: event
//   }
// }

// 'use strict';
// exports.main = async (event, context) => {
// 	//event为客户端上传的参数
// 	console.log('event : ', event)
	
// 	//返回数据给客户端
// 	return event
// };



// 'use strict';
// exports.main = async (event, context) => {
// 	//event为客户端上传的参数
// 	console.log('event : ', event)

// 	//返回数据给客户端
// 	return event
// };

