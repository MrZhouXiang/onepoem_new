package com.puyun.myshop.base.util;

import java.util.TimerTask;

import org.apache.log4j.Logger;

public class ResetPwdTask extends TimerTask
{
    private static final Logger logger = Logger.getLogger(ResetPwdTask.class);
    private String tel;
    private String uuid;
    
    public String getTel()
    {
        return tel;
    }
    
    public void setTel(String tel)
    {
        this.tel = tel;
    }
    
    public String getUuid()
    {
        return uuid;
    }
    
    public void setUuid(String uuid)
    {
        this.uuid = uuid;
    }
    
    public ResetPwdTask(String tel, String uuid)
    {
        super();
        this.tel = tel;
        this.uuid = uuid;
    }

    @Override
    public void run()
    {
        TaskPool.removeTask(TaskPool.getTask(uuid)); //移除并取消任务
        logger.info("timer size : " + TimerManager.size());
    }
}
