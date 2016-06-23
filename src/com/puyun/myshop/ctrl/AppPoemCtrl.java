package com.puyun.myshop.ctrl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.puyun.myshop.base.Constants;
import com.puyun.myshop.base.util.Utils;
import com.puyun.myshop.dao.DiyPoemDao;
import com.puyun.myshop.dao.DynastyDao;
import com.puyun.myshop.dao.PoemDao;
import com.puyun.myshop.dao.UserDao;
import com.puyun.myshop.entity.DiyPoemMod;
import com.puyun.myshop.entity.DynastyMod;
import com.puyun.myshop.entity.PoemMod;
import com.puyun.myshop.entity.Result;
import com.puyun.myshop.entity.UserMod;

/**
 * 处理来自App端的请求[新]
 */
@Controller
@RequestMapping("/poem")
public class AppPoemCtrl {
	private static final Logger logger = Logger.getLogger(AppPoemCtrl.class);

	// public static Map<String, User> tokenMap = new HashMap<String, User>();
	//
	// // 下单时用于判断下单个数
	// public static Map<String, List<OrderForApp>> orderMap = new
	// HashMap<String, List<OrderForApp>>();

	@Autowired
	private PoemDao poemDao;
	@Autowired
	private UserDao userDao;
	@Autowired
	private DynastyDao dynastyDao;
	@Autowired
	private DiyPoemDao diyPoemDao;

	public AppPoemCtrl() {
		super();
		logger.debug("创建对象AppCtrl");
	}

	/**
	 * 用户发布作品
	 * 
	 * @param req
	 * @param mod
	 * @return
	 */
	@RequestMapping(value = "/publishDiyPoem")
	@ResponseBody
	public Result publishDiyPoem(HttpServletRequest req, DiyPoemMod mod) {
		Map<String, Object> result = new HashMap<String, Object>();
		String code = "";
		try {
			if (diyPoemDao.addModel(mod)) {
				result.put("id", "");
			}
			// 增加全部类型
			code = "2000";
		} catch (Exception e) {
			code = "5000";
			result.put("reason", "服务器异常");
		}
		return new Result(code, result);
	}

	/**
	 * 获取朝代列表
	 * 
	 * @param req
	 * @param id
	 * @param size
	 * @return
	 */
	@RequestMapping(value = "/getDynastyList")
	@ResponseBody
	public Result getDynastyList(HttpServletRequest req,
			@RequestParam(required = false, defaultValue = "-1") int id,
			@RequestParam(required = false, defaultValue = "10") int size) {
		Map<String, Object> result = new HashMap<String, Object>();
		String code = "";
		try {
			List<DynastyMod> list = dynastyDao.getDynastyList(id, size);
			// 增加全部类型
			list.add(0, new DynastyMod("0", "全部"));
			list.add(1, new DynastyMod("-1", "精选"));
			result.put("list", list);
			code = "2000";
		} catch (Exception e) {
			code = "5000";
			result.put("reason", "服务器异常");
		}

		return new Result(code, result);
	}

	/**
	 * 获取小诗列表
	 * 
	 * @param req
	 * @param id
	 *            第一条id
	 * @param size
	 *            大小
	 * @param page
	 *            刷新加载更多控制 -1 0 1
	 * 
	 * @param dynasty_id
	 *            作者朝代id【默认为0表示全部,-1:精选】
	 * @return
	 */
	@RequestMapping(value = "/getPoemList")
	@ResponseBody
	public Result getPoemList(HttpServletRequest req,
			@RequestParam(required = false, defaultValue = "-1") int id,
			@RequestParam(required = false, defaultValue = "10") int size,
			@RequestParam(required = false, defaultValue = "0") int page,
			@RequestParam(required = false, defaultValue = "0") int dynasty_id) {
		// List<PoemMod> list = poemDao.getPoemList(id, size, page);
		// return list;

		Map<String, Object> result = new HashMap<String, Object>();
		String code = "";
		try {
			List<PoemMod> list = poemDao
					.getPoemList(id, size, page, dynasty_id);
			result.put("list", list);
			code = "2000";
		} catch (Exception e) {
			code = "5000";
			result.put("reason", "服务器异常");
		}

		return new Result(code, result);
	}

	/**
	 * 获取服务器路径
	 * 
	 * @param req
	 * @return
	 */
	@RequestMapping(value = "/getImgUrlPath")
	@ResponseBody
	public String getImgUrlPath(HttpServletRequest req) {
		String urlPath = req.getScheme() + "://" + req.getServerName() + ":"
				+ req.getServerPort(); // url路径
		logger.debug("urlPath->" + urlPath + Constants.DEFAULT_MODEL_PATH);
		return urlPath;
	}

	/**
	 * 用户注册接口
	 * 
	 * @param req
	 * @param id
	 * @param size
	 * @param page
	 * @return
	 */
	@RequestMapping(value = "/register")
	@ResponseBody
	public Result register(HttpServletRequest req, String account, String pwd) {
		Map<String, Object> result = new HashMap<String, Object>();
		String code = "";
		try {
			int type = Utils.getTypeByAccount(account);
			if (userDao.isExit(account, type)) {
				code = "4000";
				result.put("reason", "此帐号已存在, 请尝试使用其他号码注册");
				return new Result(code, result);
			}
			// todo 插入账号
			if (userDao.addOneUser(account, pwd, type)) {
				result.put("reason", "注册成功");
				code = "2000";
			} else {
				result.put("reason", "注册失败");
				code = "4000";
			}
		} catch (Exception e) {
			code = "5000";
			result.put("reason", "服务器异常");
			logger.error(e.getMessage(), e);
		}

		return new Result(code, result);
	}

	/**
	 * 用户注册接口
	 * 
	 * @param req
	 * @param id
	 * @param size
	 * @param page
	 * @return
	 */
	@RequestMapping(value = "/login")
	@ResponseBody
	public Result login(HttpServletRequest req, String account, String pwd) {
		Map<String, Object> result = new HashMap<String, Object>();
		String code = "";
		try {
			int type = Utils.getTypeByAccount(account);
			if (!userDao.isExit(account, type)) {
				code = "4000";
				result.put("reason", "此帐号不存在");
				return new Result(code, result);
			}
			// todo 根据用户名和密码查找用户信息
			UserMod userMod = userDao.getOneUser(account, pwd, type);
			if (userMod != null) {
				result.put("reason", "登录成功");
				result.put("user", userMod);
				code = "2000";
			} else {
				result.put("reason", "登录失败,密码错误");
				code = "4000";
			}
		} catch (Exception e) {
			code = "5000";
			result.put("reason", "服务器异常");
			logger.error(e.getMessage(), e);
		}

		return new Result(code, result);
	}
}
