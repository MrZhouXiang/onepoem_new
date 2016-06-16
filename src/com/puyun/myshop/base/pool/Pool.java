package com.puyun.myshop.base.pool;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

class Pool {
	private Map<String,Object> data = null;
	public Pool(){
		data = Collections.synchronizedMap(new HashMap<String,Object>());
	}
	
	public void clear(){
		data.clear();
	}
	
	public Object getObjectByKey(String key){
		return data.get(key);
	}
	
	public void putObjectByKey(String key, Object value){
		data.put(key, value);
	}
	
	public void removeObjectByKey(String key){
		data.remove(key);
	}
	
	public boolean isEmpty(){
		return data.isEmpty();
	}
}
