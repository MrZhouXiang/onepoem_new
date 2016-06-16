package com.puyun.myshop.base.conf;

import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

import javax.xml.parsers.ParserConfigurationException;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import com.iuvei.framework.util.StringUtils;
import com.puyun.myshop.base.pool.PoolManager;
import com.puyun.myshop.base.util.FileUtils;
import com.puyun.myshop.base.xml.XmlHelper;
/**
 * 加载项目，启动的配置文件
 * @author AI-MASK
 *
 */
public class ConfParser {
	private static final String CONFIG_FILE = "myshop-config.xml";
	private static Map<String,String> configListenerMap = new HashMap<String,String>();
	
	public void parse(){
        FileUtils fileUtils = new FileUtils(CONFIG_FILE);
        InputStream is = fileUtils.getInputStream();
        Document doc = null;
		try {
			doc = XmlHelper.parse(is);
		} catch (ParserConfigurationException e) {
			throw new ConfRuntimeException("加载配置文件"+CONFIG_FILE+"时出错。",e);
		} catch (SAXException e) {
			throw new ConfRuntimeException("加载配置文件"+CONFIG_FILE+"时出错。",e);
		} catch (IOException e) {
			throw new ConfRuntimeException("加载配置文件"+CONFIG_FILE+"时出错。",e);
		}
        Element rootEle = doc.getDocumentElement();
        NodeList list = rootEle.getElementsByTagName("config");
        PoolManager poolManager = PoolManager.getInstance();
        for(int i=0;i<list.getLength();i++){
        	Element ele = (Element)list.item(i);
        	String key = ele.getAttribute("key");
        	String isListener = ele.getAttribute("listener");
        	if(StringUtils.isNotBlank(key)&&StringUtils.isNotBlank(isListener)){
        		configListenerMap.put("conListener",ele.getAttribute("value") );
        	}
        	if(StringUtils.isNotBlank(key)){
	        	poolManager.putObject(key, ele.getAttribute("value"));
        	}
        }
	}
	public static Map<String,String> getConfigListenerMap(){
		return configListenerMap;
	}
}
