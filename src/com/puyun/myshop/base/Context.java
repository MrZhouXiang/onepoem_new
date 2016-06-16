package com.puyun.myshop.base;

import java.util.Properties;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.iuvei.framework.exception.ZeroConfigurationExceptionContext;
import com.iuvei.framework.jdbc.ZeroJdbcDaoSupport;
import com.iuvei.framework.jdbc.SqlKeyManager;
import com.iuvei.framework.util.StringUtils;
import com.iuvei.framework.util.Utils;
import com.puyun.myshop.base.cachetable.CacheTableManager;
import com.puyun.myshop.base.conf.ConfManager;

/**
 * 系统的上下文类，该类负责系统的初始化。包括：<br>
 * 1、加载配置文件
 * 2、初始化异常配置
 * 3、加载SQL语句
 * 4、加载缓存表
 * 5、加载数据库代码表
 * 6、启动配置文件监听器
 */
public class Context {
	private static final Logger LOG = LoggerFactory.getLogger(Context.class);
	
	public static final String TRESS_CONTEXT = Context.class.getName();
	
	private static ZeroJdbcDaoSupport daoSupport;

	public void setDaoSupport(ZeroJdbcDaoSupport daoSupport) {
		Context.daoSupport = daoSupport;
	}
	
	public void init(){
		ConfManager.load();
		Context.configException(ConfManager.getConfig("exception-config-location"));
		Context.configCacheTables(daoSupport);
		//ConfListener.configListener();
	}
	
	static void configSqlKey(String sqlConfigLocation){
		Properties props = new Properties();
		if(StringUtils.isNotBlank(sqlConfigLocation)){
			String[] files = sqlConfigLocation.split(",");
			for(String file : files){
				props.putAll(Utils.loadPropertiesFromClasspath(file));
			}
		}
		SqlKeyManager.load(props);
	}
	
	private static void configCacheTables(ZeroJdbcDaoSupport daoSupport){
		CacheTableManager.load(daoSupport);
	}
	
	/**
	 * 加载异常配置文件。
	 */
	private static void configException(String execptionConfigLocation){
		if(StringUtils.isBlank(execptionConfigLocation)){
			return;
		}
		LOG.info("Loading exception configuration from file(s): ["+execptionConfigLocation+"]");
		ZeroConfigurationExceptionContext.init(execptionConfigLocation.split(","));
	}
}
