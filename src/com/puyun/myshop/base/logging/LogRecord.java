package com.puyun.myshop.base.logging;

import java.util.Date;

import javax.servlet.http.HttpServletRequest;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;

@Aspect
public class LogRecord
{
    
    private static final Logger logger = LoggerFactory.getLogger(LogRecord.class);
    
    @Around("execution(public * com.puyun.myshop.ctrl.*.*(..))")
    public Object logWebRequest(ProceedingJoinPoint pjp)
        throws Throwable
    {
        // 获取request
        HttpServletRequest request =
            (HttpServletRequest)RequestContextHolder.currentRequestAttributes()
                .resolveReference(RequestAttributes.REFERENCE_REQUEST);
        
        // 获得Session
        // HttpSession session =
        // (HttpSession)RequestContextHolder.currentRequestAttributes()
        // .resolveReference(RequestAttributes.REFERENCE_SESSION);
        // 获取IP地址
        String ip = request.getRemoteAddr();
        // 获取请求地址
        String uri = request.getRequestURI();
        // 取到当前的操作用户
        String userName = "";
        
        /*
         * if (session != null) { Object objUser = session.getAttribute(Constants.LOGIN_KEY); if (objUser != null &&
         * objUser instanceof UserEntity) { userName = ((UserEntity) objUser).getName(); } else if (objUser == null) {
         * return pjp.proceed(); } else { session.removeAttribute("loginAccount");
         * session.removeAttribute(Constants.LOGIN_KEY); return "jsp/login"; } }
         */
        String sign = pjp.getSignature().getName();
        
        // 日志记录
        logger.debug("==============操作时间" + new Date() + "===============");
        logger.debug("记录web请求");
        logger.debug("客户操作IP地址:" + ip);
        logger.debug("登录用户:" + userName);
        logger.debug("访问请求地址" + uri);
        logger.debug("执行方法名称:" + sign);
        logger.debug("============================================");
        // 执行目标方法
        return pjp.proceed();
    }
    
    @AfterThrowing(pointcut = "execution(* com.puyun.myshop.ctrl.*.*(..))", throwing = "ex")
    public void loggerException(Exception ex)
    {
        logger.error("=========  异常错误记录  =========");
        logger.error("Time:" + new Date().toString());
        logger.error("Msg:" + ex.toString());
    }
    
}
