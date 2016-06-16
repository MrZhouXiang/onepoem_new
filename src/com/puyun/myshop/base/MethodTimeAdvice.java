package com.puyun.myshop.base;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;

import org.aopalliance.intercept.MethodInterceptor;
import org.aopalliance.intercept.MethodInvocation;
import org.apache.commons.lang.time.StopWatch;
import org.apache.log4j.Logger;

/**
 * 用来监控方法的执行时间-- 对应配置文件是spring-method-aop.xml
 * 
 * @author wangyong
 * @version $Id: MethodTimeAdvice.java, v 0.1 2012-9-18 下午4:30:32 wangyong Exp $
 */
public class MethodTimeAdvice implements MethodInterceptor
{
    private final static Logger logger = Logger.getLogger(MethodTimeAdvice.class);
    
    /**
     * @see org.aopalliance.intercept.MethodInterceptor#invoke(org.aopalliance.intercept.MethodInvocation)
     */
    public Object invoke(MethodInvocation invocation)
        throws Throwable
    {
        Object result = null;
        StopWatch clock = null;
        String className = null;
        String methodName = null;
        // 未启用调试模式，不计时
        if (logger.isDebugEnabled())
        {
            // 用 commons-lang 提供的 StopWatch 计时，Spring 也提供了一个 StopWatch
            clock = new StopWatch();
            clock.start(); // 计时开始
            // 监控的类名
            className = invocation.getMethod().getDeclaringClass().getSimpleName();
            // 监控的方法名
            methodName = className + "." + invocation.getMethod().getName();
        }
        
        try
        {
            // 这个是我们监控的bean的执行并返回结果
            result = invocation.proceed();
        }
        catch (Throwable e)
        {
            // 监控的参数
            Object[] objs = invocation.getArguments();
            logger.error("数据库执行异常,方法名：" + methodName + "参数:" + getString(objs), e);
            throw e;
        }
        
        // 未启用调试模式，不打印时间
        if (logger.isDebugEnabled())
        {
            clock.stop(); // 计时结束
            logger.debug("执行时间:" + clock.getTime() + " ms [" + methodName + "]");
        }
        return result;
    }
    
    /**
     * 这个类主要是用于输出方法的参数
     * 
     * @param objs
     * @return
     */
    @SuppressWarnings("unchecked")
    public String getString(Object[] objs)
    {
        StringBuffer stringBuffer = new StringBuffer();
        for (int i = 0, len = objs.length; i < len; i++)
        {
            if (objs[i] instanceof String)
            {
                stringBuffer.append("String类型：" + objs[i].toString());
            }
            else if (objs[i] instanceof Map)
            {
                HashMap<String, Object> hashMap = (HashMap<String, Object>)objs[i];
                HashMap<String, Object> map = hashMap;
                HashSet<String> set = (HashSet<String>)map.keySet();
                stringBuffer.append("Map类型");
                for (String str : set)
                {
                    stringBuffer.append(str + "=" + map.get(str));
                }
            }
            else if (objs[i] instanceof Integer)
            {
                stringBuffer.append("整数类型：");
                stringBuffer.append(objs[i].toString());
            }
            else
            {
                stringBuffer.append(objs[i].toString());
            }
        }
        return stringBuffer.toString();
    }
}