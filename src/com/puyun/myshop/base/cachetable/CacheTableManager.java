package com.puyun.myshop.base.cachetable;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.iuvei.framework.jdbc.ZeroJdbcDaoSupport;
import com.iuvei.framework.jdbc.QueryResultRow;
import com.iuvei.framework.util.StringUtils;
import com.puyun.myshop.base.conf.ConfManager;

/**
 * 缓存表管理器，管理缓存表，具备加载、更新、查找缓存表功能。
 *
 */
public class CacheTableManager {

	private static final Logger LOG = LoggerFactory.getLogger(CacheTableManager.class);
	private static Map<String,List<QueryResultRow>> cacheTableMap = new HashMap<String,List<QueryResultRow>>();

	public static List<QueryResultRow> getCacheTable(String tableName){
		if(StringUtils.isBlank(tableName)){
			return null;
		}
		return cacheTableMap.get(tableName.toLowerCase());
	}
	
	/**
	 * 清空缓存表
	 */
	public static void clear(){
		cacheTableMap.clear();
	}
	
	/**
	 * 从数据库中加载缓存表
	 * @param configValue
	 */
	public static void load(ZeroJdbcDaoSupport daoSupport){
		String configValue = ConfManager.getConfig("cache-table-config");
		if(StringUtils.isBlank(configValue)){
			LOG.info("没有找到缓存表配置项，不配置缓存表。");
			return;
		}
		
		List<TableConfig> configList = parseConfigValue(configValue);
		if(configList==null || configList.isEmpty()){
			LOG.info("缓存表配置项无效，不配置缓存表。");
			return;
		}
		
		LOG.info("开始配置缓存表");
		String sql = null;
		for(TableConfig config : configList){
			if(config.getColumnNames().isEmpty()){
				sql = "SELECT DISTINCT * FROM "+config.getTableName();
			}else{
				sql = "SELECT DISTINCT "+StringUtils.join(config.getColumnNames(), ',')+" FROM "+config.getTableName();
			}
			LOG.debug("执行查询语句 : "+sql);
			List<QueryResultRow> list = daoSupport.queryForList(sql);
			LOG.debug("从缓存表 "+config.getTableName().toLowerCase()+" 中加载了 "+list.size()+" 条数据");
			cacheTableMap.put(config.getTableName().toLowerCase(),list);
		}
		LOG.info("缓存表配置完成");
		
	}
	/**
	 * 解析配置参数
	 * @param str
	 * @return
	 */
	private static List<TableConfig> parseConfigValue(String str){
		if(StringUtils.isBlank(str)){
			return null;
		}
		
		List<TableConfig> list = new ArrayList<TableConfig>();
		TableConfig config = null;
		String[] arr = str.split(";");
		for(String item: arr){
			if(StringUtils.isBlank(item))
				continue;
			
			String[] splits = item.split(",");
			if(splits==null || splits.length<1 || StringUtils.isBlank(splits[0])){
				LOG.warn("无效的缓存表配置项"+item+":没有指定表名");
				continue;
			}
			
			config = new TableConfig();
			config.setTableName(splits[0].trim());
			
			for(int i=1;i<splits.length;i++){
				if(StringUtils.isNotBlank(splits[i])){
					config.addColumnName(splits[i].trim());
				}
			}
			
			list.add(config);
		}
		
		return list;
	}
}
