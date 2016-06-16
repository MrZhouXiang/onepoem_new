package com.puyun.myshop.base;

import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.Map;

import org.apache.log4j.Logger;

/**
 * 热门消息任务队列
 * @author user
 *
 */
public class WorkQueue
{
	private static final Logger logger = Logger.getLogger(WorkQueue.class);
	
    private final int nThreads;// 线程池的大小
    
    private final int queueSize;// 任务队列的大小
    
    private final PoolWorker[] threads;// 用数组实现线程池
    
    private final LinkedList<Map<String,Runnable>> queue;// 任务队列
    
    private final long WAITTIME;// 任务执行后等待时间
    
    public WorkQueue(int nThreads, int queueSize, long WAITTIME)
    {
        this.nThreads = nThreads;
        queue = new LinkedList<Map<String,Runnable>>();
        threads = new PoolWorker[nThreads];
        this.queueSize = queueSize;
        this.WAITTIME = WAITTIME;
        
        for (int i = 0; i < nThreads; i++)
        {
            threads[i] = new PoolWorker();
            threads[i].start();// 启动所有工作线程
        }
    }
    
    /**
     * 
     * TODO	执行任务.
     * <p>方法详细说明,如果要换行请使用<br>标签</p>
     * <br>
     * author: 周震
     * date: 2015年9月10日 下午3:50:48
     * @param key
     * @param run
     */
    public void execute(String key,Runnable run)
    {
    	Map<String, Runnable> map = null;
        synchronized (queue)
        {
        	logger.debug("queue.size()--->" + queue.size());
            map = new HashMap<String, Runnable>();
            //为保证与每个商品相关的三种热门消息在队列中只存在一条
            //key格式:商品ID_消息类型
            //设计图买断数量:buyoutOrderCount
            //成衣秀交易额:designerTradeAmount
            //成衣秀/设计图/买家秀/定制单的累计评论数量:discussCount
        	if(map.containsKey(key)){
        		map.remove(key);
        	}else{
        		map.put(key, run);
        	}
            if (queue.size() >= queueSize)
            {
            	logger.debug("任务队列已满，需要清空队列");
                // 清空队列重新增加
                queue.clear();
                queue.addLast(map);
                queue.notify();
            }
            else
            {
                queue.addLast(map);
                queue.notify();
            }
        }
    }
    
    private class PoolWorker extends Thread
    {
        
        // 工作线程类
        public void run()
        {
        	Map<String, Runnable> map;
        	Runnable run;
            while (true)
            {
                synchronized (queue)
                {
                    while (queue.isEmpty())
                    {// 如果任务队列中没有任务，等待
                        try
                        {
                            queue.wait();
                        }
                        catch (InterruptedException ignored)
                        {
                        	logger.error(ignored);
                        }
                    }
                    map = (Map<String, Runnable>)queue.removeFirst();// 有任务时，取出任务
                }
                try
                {
                	if(map != null && map.size() > 0){
                        // 执行任务
                    	for (Iterator<?> iter = map.keySet().iterator(); iter.hasNext();){
                    		String key = (String)iter.next();
                    		run = map.get(key);
                    		run.run();
                    		Thread.sleep(WAITTIME);// 任务执行后等待
                    	}
                	}
                    
                }
                catch (RuntimeException e)
                {
                    // You might want to log something here
                	logger.error(e);
                }
                catch (InterruptedException e)
                {
                    // TODO Auto-generated catch block
                    logger.error(e);
                }
            }
        }
    }
    
    public int getnThreads()
    {
        return nThreads;
    }
    
    public int getQueueSize()
    {
        return queueSize;
    }
    
    public PoolWorker[] getThreads()
    {
        return threads;
    }
    
    public LinkedList<Map<String,Runnable>> getQueue()
    {
        return queue;
    }
}
