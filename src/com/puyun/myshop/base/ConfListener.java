package com.puyun.myshop.base;

import java.io.File;
import java.util.Timer;
import java.util.TimerTask;



import com.puyun.myshop.base.conf.ConfParser;
/**
 * 开启定时器循环读取配置文件
 * @author song.qiu
 *
 */
public class ConfListener {
	/**
	 * 配置文件的最后更新时间
	 */
	private static long lastModified = 0;
	
	private final static String CONFIGVALUE = ConfParser.getConfigListenerMap().get("conListener") ;
	
	public static void configListener(){
		/*Timer timer = new Timer();
		timer.schedule(new TimerTask() {
			@Override
			public void run() {
				if(isFileUpdated(config_value)){//config_value.contains("sql")&&
					Context.configSqlKey(config_value);
				}
			}
		}, 1*1000, 1000);*/
	}
	/**
	 * 判断文件是否已被更新
	 * @param fileName
	 * @return
	 */
	private static boolean isFileUpdated(String fileName){
		String filepath = (ConfListener.class.getResource("/")+fileName).substring(6);
		File file = new File(filepath);
		if(file.isFile()){
			long lastUpdateTime = file.lastModified();
			if(lastUpdateTime>lastModified){
				//System.out.println(fileName+" was modified");
				lastModified = lastUpdateTime;
				return true;
			}else {
				return false;
			}
		}else{
			return false;
		}
	}
}
