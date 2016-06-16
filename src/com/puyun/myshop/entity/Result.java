package com.puyun.myshop.entity;

import java.util.Map;

public class Result
{
    private String code;// 响应代码
    
    private Map<?, ?> result;// 响应数据
    
    public Result()
    {
        super();
    }
    
    public Result(String code, Map<?, ?> result)
    {
        super();
        this.code = code;
        this.result = result;
    }

    public String getCode()
    {
        return code;
    }

    public void setCode(String code)
    {
        this.code = code;
    }

    public Map<?, ?> getResult()
    {
        return result;
    }

    public void setResult(Map<?, ?> result)
    {
        this.result = result;
    }
    
    @Override
    public String toString()
    {
        return "result="+result+"\n"+ "code="+code;
    }
}
