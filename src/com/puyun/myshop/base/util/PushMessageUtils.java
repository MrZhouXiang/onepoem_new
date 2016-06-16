package com.puyun.myshop.base.util;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;
/**
 * 推送调用接口
 * @author zsw
 *
 */
public class PushMessageUtils {

	public static String sendPost(String action,String broadcast, String username,
			String title,String message,String uri) throws FileNotFoundException, IOException{
		//http://221.226.18.34:3700/notification.do
		Properties props =new Properties();
		props.load(new FileInputStream("src/pushMessage.properties"));
		String path=props.getProperty("xmppHost");
		//System.out.println("path="+path);
		Map<String, String> params = new HashMap<String, String>();
		params.put("action", action);
		params.put("broadcast", broadcast);
		params.put("username", username);
		params.put("title", title);
		params.put("message", message);
		params.put("uri", uri);
		try {
			return sendPostRequest(path, "utf-8", params);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return "访问服务器失败";
	}

	/**
	 * 发送post数据
	 * @param path
	 * @param encoding
	 * @param params
	 * @return
	 * @throws Exception
	 */
	private static String sendPostRequest(String path, String encoding,Map<String, String> params) throws Exception {

		StringBuilder data = new StringBuilder();

		if (params != null && !params.isEmpty()) {

			for (Map.Entry<String, String> entry : params.entrySet()) {
				data.append(URLEncoder.encode(entry.getKey(), encoding)).append("=");
				/**
				 * 下面两种转码格式都可以
				 */
				data.append(URLEncoder.encode(entry.getValue(), encoding));
				data.append("&");
			}
			data.deleteCharAt(data.length() - 1);
		}
		//System.out.println("date"+data.toString());
		byte[] entity = data.toString().getBytes(); // 得到实体数据
		HttpURLConnection conn = (HttpURLConnection) new URL(path).openConnection();
		conn.setReadTimeout(5000);
		conn.setRequestMethod("POST");
		conn.setDoOutput(true); // 允许对外输出数据
		conn.setRequestProperty("Content-Type",
				"application/x-www-form-urlencoded");
		conn.setRequestProperty("Content-Length", String.valueOf(entity.length));

		OutputStream outputStream = conn.getOutputStream();
		outputStream.write(entity);

		if (conn.getResponseCode() == 200) {

			//System.out.println("建立连接");

			InputStream inputStream = conn.getInputStream();

			return "连接成功";
		}
		return null;
	}
	
//	public static void main(String[] args) {
//		try {
//			PushMessageService.sendPostTest("send", "A","4e346a5c46594c5aa1ef89bfeb25cbac", "daye", "xinxi", "uri");
//		} catch (FileNotFoundException e) {
//			// TODO Auto-generated catch block
//			e.printStackTrace();
//		} catch (IOException e) {
//			// TODO Auto-generated catch block
//			e.printStackTrace();
//		}
//	}

}
