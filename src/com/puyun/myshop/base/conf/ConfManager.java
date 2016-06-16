package com.puyun.myshop.base.conf;

import com.puyun.myshop.base.pool.PoolManager;

/**
 * 配置文件加载类，用于加载本系统的配置项。
 *
 */
public class ConfManager {
	private static boolean loaded = false;
	public static void load(){
		if(!loaded){
			new ConfParser().parse();
			loaded = true;
		}
	}
	
	public static String getConfig(String key){
		return (String)PoolManager.getInstance().getObject(key);
	}
}
