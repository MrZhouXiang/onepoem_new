package com.puyun.myshop.ctrl;

import java.io.File;
import java.io.FileOutputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.puyun.myshop.base.Constants;
import com.puyun.myshop.base.util.Utils;
import com.puyun.myshop.dao.DiyPoemDao;
import com.puyun.myshop.dao.DynastyDao;
import com.puyun.myshop.dao.PoemDao;
import com.puyun.myshop.dao.TagDao;
import com.puyun.myshop.dao.UserDao;
import com.puyun.myshop.entity.DiyPoemMod;
import com.puyun.myshop.entity.DynastyMod;
import com.puyun.myshop.entity.PoemMod;
import com.puyun.myshop.entity.Result;
import com.puyun.myshop.entity.TagMod;
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
	@Autowired
	private TagDao tagDao;
	
	public AppPoemCtrl() {
		super();
		logger.debug("创建对象AppCtrl");
	}

	/**
	 * 获取作品列表
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
	@RequestMapping(value = "/getDiyPoemList")
	@ResponseBody
	public Result getDiyPoemList(HttpServletRequest req,
			@RequestParam(required = false, defaultValue = "-1") int id,
			@RequestParam(required = false, defaultValue = "10") int size,
			@RequestParam(required = false, defaultValue = "0") int page,
			@RequestParam(required = false, defaultValue = "") String tag) {
		// List<PoemMod> list = poemDao.getPoemList(id, size, page);
		// return list;

		Map<String, Object> result = new HashMap<String, Object>();
		String code = "";
		try {
			List<DiyPoemMod> list = diyPoemDao.getDiyPoemList(id, size, page,
					tag);
			result.put("list", list);
			code = "2000";
		} catch (Exception e) {
			code = "5000";
			result.put("reason", "服务器异常");
		}

		return new Result(code, result);
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

			// 插入model
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
	 * 获取tag列表
	 * 
	 * @param req
	 * @param id
	 * @param size
	 * @return
	 */
	@RequestMapping(value = "/getTagList")
	@ResponseBody
	public Result getTagList(HttpServletRequest req) {
		Map<String, Object> result = new HashMap<String, Object>();
		String code = "";
		try {
			List<TagMod> list = tagDao.getTagList();
			// 增加全部类型
			list.add(0, new TagMod("0", "全部"));
			list.add(1, new TagMod("-1", "精选"));
			result.put("list", list);
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

	/**
	 * 上传照片
	 * 
	 * @param req
	 * @param orderCode
	 *            订单ID
	 * @param goodsId
	 *            商品ID
	 * @return author: ldz
	 * @see [类、类#方法、类#成员]
	 */
	/**
	 * @param req
	 * @param orderCode
	 * @param goodsId
	 * @param type
	 * @param filePath
	 * @param count
	 * @return
	 */
	/**
	 * @param req
	 * @param orderCode
	 * @param goodsId
	 * @param type
	 * @param filePath
	 * @param count
	 * @return
	 */
	@RequestMapping(value = "/upload")
	@ResponseBody
	public Result uploadPhoto(HttpServletRequest req, String orderCode,
			String goodsId, @RequestParam(defaultValue = "1") int type,
			String filePath, @RequestParam(defaultValue = "1") String count) {
		logger.debug("uploadPhoto ");
		System.out.println(filePath);
		Map<String, Object> map = new HashMap<String, Object>();
		String code = "";
		try {
			String defPath = "";
			switch (type) {
			case 1:// 用户
				defPath = Constants.DEFAULT_AVATAR_PATH;
				break;
			case 2:// 公告图片
				defPath = Constants.DEFAULT_NOTI_PATH;
				break;
			case 3:// 活动图片
				defPath = Constants.DEFAULT_PARTY_PATH;
				break;
			case 4:// 公司logo
				defPath = Constants.DEFAULT_LOGO_PATH;
				break;
			case 5:// 产品图片
				defPath = Constants.DEFAULT_PRODUCTION_PATH;
				break;
			case 6:// 机构logo
				defPath = Constants.DEFAULT_ORGANIZATION_PATH;
				break;
			case 7:// diy图片
				defPath = Constants.DEFAULT_DIY_PATH;
				break;
			case 8:// 诗图片
				defPath = Constants.DEFAULT_MODEL_PATH;
				break;
			case 9:// 诗作者图片
				defPath = Constants.DEFAULT_AUTHOR_PATH;
				break;
			default:
			}
			String path = req.getSession().getServletContext()
					.getRealPath(defPath);
			File dirFile = new File(path);
			// 创建目录
			if (!dirFile.exists()) {
				dirFile.mkdirs();
			}
			if (req instanceof MultipartHttpServletRequest) {
				MultipartHttpServletRequest request = (MultipartHttpServletRequest) req;
				Iterator<String> itr = request.getFileNames();
				List<String> fileNameList = new ArrayList();
				while (itr.hasNext()) {// 循环保存文件
					// String md5 = Utils
					// .md5Encode(orderCode + goodsId + filePath);
					String md5 = Utils.md5Encode(String.valueOf(UUID
							.randomUUID()));
					String tmpName = null;// 文件名
					MultipartFile mpf = request.getFile(itr.next());
					String subfix = "";// 后缀
					if (mpf.getOriginalFilename().indexOf(".") != -1) {
						subfix = mpf.getOriginalFilename().substring(
								mpf.getOriginalFilename().lastIndexOf(".")); // 获取图片后缀
					}
					tmpName = md5 + subfix;
					// 得到图片保存目录的真实路径
					String realpath = request.getSession().getServletContext()
							.getRealPath(defPath + tmpName);
					FileOutputStream fps = new FileOutputStream(realpath);
					FileCopyUtils.copy(mpf.getBytes(), fps);

					// 文件名保存
					fileNameList.add(tmpName);
				}
				if (fileNameList.size() > 0) {
					code = "2000";
					//
					map.put("fileNameList", fileNameList);
				}

			} else {
				code = "4001";
				logger.debug("请求中没有照片");
			}

		} catch (Exception e) {
			code = "5000";
			logger.error(e.getMessage(), e);
		}
		Result ret = new Result(code, map);
		logger.debug("返回" + map.values());
		return ret;
	}
}
