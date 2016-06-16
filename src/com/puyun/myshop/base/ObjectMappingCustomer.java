package com.puyun.myshop.base;

import java.io.IOException;

import org.codehaus.jackson.JsonGenerator;
import org.codehaus.jackson.JsonParser;
import org.codehaus.jackson.JsonProcessingException;
import org.codehaus.jackson.map.JsonSerializer;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.map.SerializerProvider;

/**
 * 
 * 自定义Jackson对象转换映射 
 * @author  姓名
 * @version  [版本号, 2014-10-21]
 * @see  [相关类/方法]
 * @since  [产品/模块版本]
 */
public class ObjectMappingCustomer extends ObjectMapper
{
    private static ObjectMapper objectMapper = null;
    
    public ObjectMappingCustomer()
    {
        super();
        
        // 允许单引号
        this.configure(JsonParser.Feature.ALLOW_SINGLE_QUOTES, true);
        
        // 字段和值都加引号
        //this.configure(JsonParser.Feature.ALLOW_UNQUOTED_FIELD_NAMES, true);
        
        // 数字也加引号
        this.configure(JsonGenerator.Feature.WRITE_NUMBERS_AS_STRINGS, true);
        this.configure(JsonGenerator.Feature.QUOTE_NON_NUMERIC_NUMBERS, true);
        
        // 空值处理为空串
        this.getSerializerProvider().setNullValueSerializer(new JsonSerializer<Object>()
        {
            @Override
            public void serialize(Object arg0, JsonGenerator arg1, SerializerProvider arg2)
                throws IOException, JsonProcessingException
            {
                //null值处理为""
                arg1.writeString("");
                
            }
            
        });
        objectMapper = this;
    }
    
    public static ObjectMapper getObjectMapper()
    {
        //如果spring没有初始化ObjectMapper，则创建新对象
        if (objectMapper == null)
        {
            objectMapper = new ObjectMappingCustomer();
        }
        return objectMapper;
    }
}
