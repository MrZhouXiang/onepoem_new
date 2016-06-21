package com.puyun.myshop.ctrl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import cn.jpush.api.report.UsersResult.User;

import com.puyun.myshop.base.Constants;
import com.puyun.myshop.dao.AuthorDao;
import com.puyun.myshop.dao.DynastyDao;
import com.puyun.myshop.dao.PoemDao;
import com.puyun.myshop.dao.UserDao;
import com.puyun.myshop.entity.AuthorMod;
import com.puyun.myshop.entity.DynastyMod;
import com.puyun.myshop.entity.PageBean;
import com.puyun.myshop.entity.PoemMod;
import com.puyun.myshop.entity.UserMod;

/**
 * 处理来自web端的请求
 */
@Controller
@RequestMapping("/webctrl")
public class WebCtrl {
	private static final Logger logger = Logger.getLogger(WebCtrl.class);

	public static Map<String, User> tokenMap = new HashMap<String, User>();

	// 下单时用于判断下单个数

	@Autowired
	private AuthorDao authorDao;
	@Autowired
	private PoemDao poemDao;
	@Autowired
	private DynastyDao dynastyDao;
	@Autowired
	private UserDao userDao;

	public WebCtrl() {
		super();
		logger.debug("创建对象AppCtrl");
	}

	/**
	 * 获取用户列表
	 * 
	 * @param id
	 * @param size
	 * @return
	 */
	@RequestMapping(value = "/getUserList/{p}")
	@ResponseBody
	public Map<String, Object> getUserList(HttpServletRequest req,
			PageBean page, String keyword, @PathVariable int p,
			@RequestParam(defaultValue = "10") int num) {
		// List<AuthorMod> list = authorDao.getAuthorList(id, size, -1);
		// return list;
		Map<String, Object> map = new HashMap<String, Object>();
		String urlPath = req.getScheme() + "://" + req.getServerName() + ":"
				+ req.getServerPort(); // url路径
		urlPath = Constants.DEFAULT_AVATAR_PATH;
		logger.debug("urlPath-->" + urlPath);
		try {
			// http://127.0.0.1:8080
			int start = (p - 1) * num;
			int count = 100;
			List<UserMod> list = userDao.getUserList(keyword, start, num);
			// return list;
			if (list == null) {
				map.put("success", false);
			} else {
				map.put("success", true);
				map.put("url", urlPath);
				map.put("result", list);

				map.put("totalPage", ((count - 1) / num) + 1);
				map.put("total", count);
				map.put("curPage", p);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return map;
	}

	/**
	 * 
	 * 修改用户
	 * 
	 * @param req
	 * @param model
	 * @return
	 */
	@ResponseBody
	@RequestMapping(value = "/updateUser")
	public Map<String, Object> updateUser(HttpServletRequest req, UserMod model) {

		Map<String, Object> map = new HashMap<String, Object>();
		boolean flag = userDao.updateUser(model);
		if (flag) {
			map.put("success", true);
			logger.debug("操作成功");
		} else {
			map.put("success", false);
			logger.debug("操作失败");
		}
		return map;
	}

	/**
	 * 
	 * 获取一用户
	 * 
	 * @param req
	 * @param model
	 * @return
	 */
	@ResponseBody
	@RequestMapping(value = "/getUser")
	public UserMod getUser(HttpServletRequest req, int id) {

		UserMod mod = userDao.getUser(id);
		return mod;
	}

	/**
	 * 获取朝代列表
	 * 
	 * @param id
	 * @param size
	 * @return
	 */
	@RequestMapping(value = "/getDynastyList")
	@ResponseBody
	public List<DynastyMod> getDynastyList(int id, int size) {
		List<DynastyMod> list = dynastyDao.getDynastyList(id, size);
		return list;
	}

	/**
	 * 获取诗人列表
	 * 
	 * @param id
	 * @param size
	 * @return
	 */
	@RequestMapping(value = "/getAuthorList")
	@ResponseBody
	public List<AuthorMod> getAuthorList(int id, int size) {
		List<AuthorMod> list = authorDao.getAuthorList(id, size, -1);
		return list;
	}

	/**
	 * 获取诗人列表[]
	 * 
	 * @param id
	 * @param size
	 * @return
	 */
	@RequestMapping(value = "/getAuthorList/{p}")
	@ResponseBody
	public Map<String, Object> getAuthorList(HttpServletRequest req,
			PageBean page, String keyword, @PathVariable int p,
			@RequestParam(defaultValue = "10") int num) {
		// List<AuthorMod> list = authorDao.getAuthorList(id, size, -1);
		// return list;
		Map<String, Object> map = new HashMap<String, Object>();
		String urlPath = req.getScheme() + "://" + req.getServerName() + ":"
				+ req.getServerPort(); // url路径
		urlPath = Constants.DEFAULT_AUTHOR_PATH;
		logger.debug("urlPath-->" + urlPath);
		try {
			// http://127.0.0.1:8080
			int start = (p - 1) * num;
			// List<Model> list = modelDao.getModelList(keyword, start, num);
			int count = 100;
			List<AuthorMod> list = authorDao.getAuthorList(keyword, start, num);
			// return list;
			if (list == null) {
				map.put("success", false);
			} else {
				map.put("success", true);
				map.put("url", urlPath);
				map.put("result", list);

				map.put("totalPage", ((count - 1) / num) + 1);
				map.put("total", count);
				map.put("curPage", p);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return map;
	}

	/**
	 * 
	 * 获取一位诗人
	 * 
	 * @param req
	 * @param model
	 * @return
	 */
	@ResponseBody
	@RequestMapping(value = "/getAuthor")
	public AuthorMod getAuthor(HttpServletRequest req, int id) {

		AuthorMod mod = authorDao.getAuthor(id);
		return mod;
	}

	/**
	 * 
	 * 修改一首诗
	 * 
	 * @param req
	 * @param model
	 * @return
	 */
	@ResponseBody
	@RequestMapping(value = "/deleteOneAuthor")
	public Map<String, Object> deleteOneAuthor(HttpServletRequest req, int id) {

		Map<String, Object> map = new HashMap<String, Object>();
		boolean flag = authorDao.deleteModel(id);
		if (flag) {
			map.put("success", true);
			logger.debug("操作成功");
		} else {
			map.put("success", false);
			logger.debug("操作失败");
		}
		return map;
	}

	/**
	 * 
	 * 增加一首诗
	 * 
	 * @param req
	 * @param model
	 * @return
	 */
	@ResponseBody
	@RequestMapping(value = "/newPoem")
	public Map<String, Object> addPoem(HttpServletRequest req, PoemMod model) {

		Map<String, Object> map = new HashMap<String, Object>();
		boolean flag = poemDao.addModel(model);
		if (flag) {
			map.put("success", true);
			logger.debug("操作成功");
		} else {
			map.put("success", false);
			logger.debug("操作失败");
		}
		return map;
	}

	/**
	 * 
	 * 修改一首诗
	 * 
	 * @param req
	 * @param model
	 * @return
	 */
	@ResponseBody
	@RequestMapping(value = "/updatePoem")
	public Map<String, Object> updatePoem(HttpServletRequest req, PoemMod model) {

		Map<String, Object> map = new HashMap<String, Object>();
		boolean flag = poemDao.updateModel(model);
		if (flag) {
			map.put("success", true);
			logger.debug("操作成功");
		} else {
			map.put("success", false);
			logger.debug("操作失败");
		}
		return map;
	}

	/**
	 * 删除一首小诗
	 * 
	 * @param req
	 * @param model
	 * @return
	 */
	@ResponseBody
	@RequestMapping(value = "/deleteOnePoem")
	public Map<String, Object> deleteOnePoem(HttpServletRequest req, int id) {

		Map<String, Object> map = new HashMap<String, Object>();
		boolean flag = poemDao.deleteModel(id);
		if (flag) {
			map.put("success", true);
			logger.debug("操作成功");
		} else {
			map.put("success", false);
			logger.debug("操作失败");
		}
		return map;
	}

	/**
	 * 
	 * 获取一首诗
	 * 
	 * @param req
	 * @param model
	 * @return
	 */
	@ResponseBody
	@RequestMapping(value = "/getPoem")
	public PoemMod getPoem(HttpServletRequest req, int id) {

		PoemMod mod = poemDao.getPoem(id);
		return mod;
	}

	/**
	 * 
	 * 增加一位诗人
	 * 
	 * @param req
	 * @param model
	 * @return
	 */
	@ResponseBody
	@RequestMapping(value = "/newAuthor")
	public Map<String, Object> addAuthor(HttpServletRequest req, AuthorMod model) {

		Map<String, Object> map = new HashMap<String, Object>();
		boolean flag = authorDao.addModel(model);
		if (flag) {
			map.put("success", true);
			logger.debug("操作成功");
		} else {
			map.put("success", false);
			logger.debug("操作失败");
		}
		return map;
	}

	/**
	 * 
	 * 修改一位诗人
	 * 
	 * @param req
	 * @param model
	 * @return
	 */
	@ResponseBody
	@RequestMapping(value = "/updateAuthor")
	public Map<String, Object> updateAuthor(HttpServletRequest req,
			AuthorMod model) {

		Map<String, Object> map = new HashMap<String, Object>();
		boolean flag = authorDao.updateAuthor(model);
		if (flag) {
			map.put("success", true);
			logger.debug("操作成功");
		} else {
			map.put("success", false);
			logger.debug("操作失败");
		}
		return map;
	}

	@RequestMapping(value = "/getPoemList/{p}")
	@ResponseBody
	public Map<String, Object> getPoemList(HttpServletRequest req,
			PageBean page, String keyword, @PathVariable int p,
			@RequestParam(defaultValue = "10") int num) {

		Map<String, Object> map = new HashMap<String, Object>();
		String urlPath = req.getScheme() + "://" + req.getServerName() + ":"
				+ req.getServerPort(); // url路径
		urlPath = Constants.DEFAULT_MODEL_PATH;
		logger.debug("urlPath-->" + urlPath);
		try {
			// http://127.0.0.1:8080
			int start = (p - 1) * num;
			// List<Model> list = modelDao.getModelList(keyword, start, num);
			int count = 100;
			List<PoemMod> list = poemDao.getPoemList(keyword, start, num);
			// return list;
			if (list == null) {
				map.put("success", false);
			} else {
				map.put("success", true);
				map.put("url", urlPath);
				map.put("result", list);

				map.put("totalPage", ((count - 1) / num) + 1);
				map.put("total", count);
				map.put("curPage", p);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return map;
	}

}
