package com.puyun.myshop.base.job;


import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import com.puyun.myshop.base.Constants;
import com.puyun.myshop.dao.AppDao;

/**
 * 
 * TODO	每天凌晨0点清空前一天的热门消息队列. 
 * Created on 2015年9月10日 下午1:42:54 
 * @author 周震
 */
public class ClearWorkQueueTask
{
    @Autowired
    private AppDao appDao;
    
    public static Logger log = Logger.getLogger(ClearWorkQueueTask.class);
    
    public void clearWorkQueueTask()
    {
        try
        {
            log.info("开始执行清空热门消息队列任务>........");
            // 清空热门消息队列
            Constants.PUSH_WORKQUEUE.getQueue().clear();
            log.info("执行清空热门消息队列任务结束>........");
        }
        catch (Exception e)
        {
            log.error("清空热门消息队列任务出现异常", e);
        }
    }
}
