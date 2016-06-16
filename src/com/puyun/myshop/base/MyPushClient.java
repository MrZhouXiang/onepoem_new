package com.puyun.myshop.base;

import java.nio.charset.Charset;
import java.util.HashMap;
import java.util.Map;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.entity.mime.MultipartEntity;
import org.apache.http.entity.mime.content.StringBody;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.util.EntityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import cn.jpush.api.JPushClient;
import cn.jpush.api.common.APIConnectionException;
import cn.jpush.api.common.APIRequestException;
import cn.jpush.api.push.PushResult;
import cn.jpush.api.push.model.Message;
import cn.jpush.api.push.model.Message.Builder;
import cn.jpush.api.push.model.Platform;
import cn.jpush.api.push.model.PushPayload;
import cn.jpush.api.push.model.audience.Audience;
import cn.jpush.api.push.model.notification.Notification;

public class MyPushClient
{
    protected static final Logger LOG = LoggerFactory.getLogger(MyPushClient.class);
    
    // demo App defined in resources/jpush-api.conf
    private static final String appKey = "a766d8d0ea0176223b9e4f91";
    
    private static final String masterSecret = "50f53a7f063d18392b997690";
      
    // public static final String TITLE = "Test from API example";
    // public static final String ALERT = "Test from API Example - alert";
    // public static final String MSG_CONTENT = "Test from API Example - msgContent";
    // public static final String REGISTRATION_ID = "0900e8d85ef";
    // public static final String TAG = "tag_api";
    private static final JPushClient jpushClient = new JPushClient(masterSecret, appKey, 3);
    
    public static JPushClient getJpushclient() {
		return jpushClient;
	}
    
    private static void testSendPush()
    {
        // HttpProxy proxy = new HttpProxy("localhost", 3128);
        // Can use this https proxy: https://github.com/Exa-Networks/exaproxy
        // For push, all you need do is to build PushPayload object.
        PushPayload payload = test1("公告", "公告");
        
        try
        {
            PushResult result = jpushClient.sendPush(payload);
            LOG.info("Got result - " + result);
        }
        catch (APIConnectionException e)
        {
            LOG.error("Connection error. Should retry later. ", e);
            
        }
        catch (APIRequestException e)
        {
            LOG.error("Error response from JPush server. Should review and fix it. ", e);
            LOG.info("HTTP Status: " + e.getStatus());
            LOG.info("Error Code: " + e.getErrorCode());
            LOG.info("Error Message: " + e.getErrorMessage());
            LOG.info("Msg ID: " + e.getMsgId());
        }
    }
    
    public static PushPayload test1(String reason, String result)
    {
        Map<String, String> data = new HashMap<String, String>();
        data.put("id", "0");
        data.put("reason", reason);
        data.put("result", result);
//        // 消息类型为“1”表示买断设计秀
//        PushMessage msg;
//        String content = "";
//        try
//        {
//            System.out.println("data:"
//                + com.puyun.myshop.base.ObjectMappingCustomer.getObjectMapper().writeValueAsString(data));
//            msg =
//                new PushMessage("0", com.puyun.myshop.base.ObjectMappingCustomer.getObjectMapper()
//                    .writeValueAsString(data));
//            System.out.println("msg:" + msg);
//            content = com.puyun.myshop.base.ObjectMappingCustomer.getObjectMapper().writeValueAsString(msg);
//            System.out.println("content:" + content);
//            
//        }
//        catch (JsonGenerationException e)
//        {
//            // TODO Auto-generated catch block
//            e.printStackTrace();
//        }
//        catch (JsonMappingException e)
//        {
//            // TODO Auto-generated catch block
//            e.printStackTrace();
//        }
//        catch (IOException e)
//        {
//            // TODO Auto-generated catch block
//            e.printStackTrace();
//        }
        Builder b =
            Message.newBuilder().setMsgContent("msgCont").setTitle("title").addExtra("type", "0").addExtras(data);
        
        return PushPayload.newBuilder().setPlatform(Platform.all()).setMessage(b.build())
         .setNotification(Notification.alert("xx"))
            .setAudience(Audience.all())
//             .setAudience(Audience.alias("shanghu_33"))
            .build();
    }
    
    public static PushResult push(PushPayload payload)
        throws APIConnectionException, APIRequestException
    {
        try
        {
            PushResult result = jpushClient.sendPush(payload);
            return result;
        }
        catch (APIConnectionException e)
        {
            throw e;
        }
        catch (APIRequestException e)
        {
            throw e;
        }
        
    }
    
    /**
     * 多文件上传
     * 
     * @param actionUrl URL
     * @param params 参数
     * @return 服务器端响应的数据，如果上传时出现异常会返回空字符串
     * @see [类、类#方法、类#成员]
     */
    public static String uploadMultiFile(String actionUrl, Map<String, String> headers, Map<String, String> params)
        throws Exception
    {
        String retVal = "";
        HttpClient httpclient = new DefaultHttpClient();
        try
        {
            HttpGet httpget = new HttpGet(actionUrl);
            MultipartEntity reqEntity = new MultipartEntity();
            
            // 请求头
            if (headers != null && headers.size() > 0)
            {
                for (Map.Entry<String, String> entry : headers.entrySet())
                {
                    httpget.setHeader(entry.getKey(), entry.getValue());
                }
            }
            
            // 添加参数
            if (params != null && params.size() > 0)
            {
                for (Map.Entry<String, String> entry : params.entrySet())
                {
                    reqEntity.addPart(entry.getKey(), new StringBody(entry.getValue(), Charset.forName("UTF-8")));// filename1为请求后台的普通参数;属性
                }
            }
            
            HttpResponse response = httpclient.execute(httpget);
            int statusCode = response.getStatusLine().getStatusCode();
            
            // 请求成功
            if (statusCode == 200)
            {
                System.out.println("请求成功");
                HttpEntity resEntity = response.getEntity();
                retVal = EntityUtils.toString(resEntity);// httpclient自带的工具类读取返回数据
                EntityUtils.consume(resEntity);
            }
            System.out.println(statusCode);
        }
        catch (Exception e)
        {
            e.printStackTrace();
        }
        finally
        {
            httpclient.getConnectionManager().shutdown();
        }
        return retVal;
    }
    
    public static void main(String[] args)
        throws Exception
    {
        // testSendPush();
        // Map<String, String> headers = new HashMap<String, String>();
        // headers.put("Authorization", "Basic " + new String(Base64.encode((appKey + ":" + masterSecret).getBytes())));
        // headers.put("Content-Type", "application/json; charset=utf-8");
        //
        // // Map<String, String> params = new HashMap<String, String>();
        // // String data = uploadMultiFile("https://device.jpush.cn/v3/aliases/15669918737", headers, params);
        // // System.out.println(data);
        //
        // Map<String, String> data = new HashMap<String, String>();
        // data.put("orderCode", "1425457547571-364706");
        // data.put("status", OrderStatus.WAITRECEIVER.toString());
        // // 推送
        // // 消息类型为“1”表示卖家已发货
        // PushMessage msg =
        // new PushMessage("1", com.puyun.myshop.base.ObjectMappingCustomer.getObjectMapper()
        // .writeValueAsString(data));
        //
        // String content = com.puyun.myshop.base.ObjectMappingCustomer.getObjectMapper().writeValueAsString(msg);
        // System.out.println(content);
        PushPayload payload = test1("喜讯", "XXXXXX发红包了！！");
//        PushPayload payload = test1("公告", "xxxxx");
        // PushPayload.newBuilder()
        // .setPlatform(Platform.all())
        // .setAudience(Audience.all())
        // .setMessage(Message.content(content))
        // .setNotification(Notification.newBuilder().addPlatformNotification(IosNotification.newBuilder().setAlert("titlexx").build())
        // .addPlatformNotification(AndroidNotification.newBuilder().setAlert("ceshix").setTitle("titlex").build())
        // .build())
        // .build();
//        PushResult result = com.puyun.myshop.base.MyPushClcom.puyun.clothingshow.base        System.out.println(result.isResultOK());
        
//         for (int i = 0; i < 5; i++)
//         {
//         pushTest(i + "、公告", i + "、公告XXXXXXXXXXXXXXXXXXXXXXX");
//         }
        
    }
    
    private static void pushTest(final String reason, final String result)
    {
        
        try
        {
            // 模拟任务间隔添加时间
            Thread.sleep(1000);
        }
        catch (InterruptedException e1)
        {
            // TODO Auto-generated catch block
            e1.printStackTrace();
        }
        
//        Constants.PUSH_WORKQUEUE.execute("key",new Runnable()
//        {
//            
//            @Override
//            public void run()
//            {
//                // TODO Auto-generated method stub
//                // 消息类型为“1”表示卖家已发货
//                try
//                {
//                    PushPayload payload = test1(reason, result);
//                    PushResult result = com.puyun.myshop.base.MyPushClient.push(payload);
//                    System.out.println(result.isResultOK());
//                }
//                catch (APIConnectionException e)
//                {
//                    // TODO Auto-generated catch block
//                    e.printStackTrace();
//                }
//                catch (APIRequestException e)
//                {
//                    // TODO Auto-generated catch block
//                    e.printStackTrace();
//                }
//                
//            }
//        });
    }
}
