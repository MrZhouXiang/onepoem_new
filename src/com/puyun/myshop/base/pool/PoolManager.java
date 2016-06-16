package com.puyun.myshop.base.pool;

/**
 * 一个维护系统运行时所有需要用到的数据的数据池管理类。
 * <p>
 * 数据来自以下途径<br>
 * 1、配置文件的配置项
 * 2、缓存的代码表
 *
 */
public class PoolManager {
	private static PoolManager poolManager = new PoolManager(); 
	
	private final Pool pool = new Pool();
	
	public static PoolManager getInstance(){
		return poolManager;
	}
	
	public Object getObject(String key){
		return pool.getObjectByKey(key);
	}
	
	public void putObject(String key,Object value){
		pool.putObjectByKey(key, value);
	}
}
