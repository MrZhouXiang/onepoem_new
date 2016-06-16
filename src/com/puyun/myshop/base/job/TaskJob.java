package com.puyun.myshop.base.job;


import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import com.puyun.myshop.dao.AppDao;
/**
 * 
 *  每30秒更新一下订单状态
 * @author  姓名
 * @version  [版本号, 2014-10-28]
 * @see  [相关类/方法]
 * @since  [产品/模块版本]
 */
public class TaskJob
{
    @Autowired
    private AppDao appDao;
    
    public static Logger log = Logger.getLogger(TaskJob.class);
    
    public void updateStatus()
    {
        try
        {
            log.info("开始执行更新订单状态任务>........");
            // 定时更新订单状态
//            appDao.updateOrderStatus();
            log.info("执行更新订单状态任务结束>........");
        }
        catch (Exception e)
        {
            log.error("更新订单状态任务出现异常", e);
        }
    }
}
