package com.puyun.myshop.daoImpl;

import java.util.List;

import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.BeanPropertySqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;

import com.puyun.myshop.base.util.ListUtils;
import com.puyun.myshop.base.util.Utils;
import com.puyun.myshop.dao.UserDao;
import com.puyun.myshop.entity.AuthorMod;
import com.puyun.myshop.entity.PoemMod;
import com.puyun.myshop.entity.UserMod;

/**
 * 用户管理相关数据访问接口实现类
 * 
 * @author zx 创建时间: 2015-2-28
 */
public class UserDaoImpl implements UserDao {
	private JdbcTemplate jdbcTemplate;

	private NamedParameterJdbcTemplate namedJdbcTemplate;

	public JdbcTemplate getJdbcTemplate() {
		return this.jdbcTemplate;
	}

	public void setJdbcTemplate(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
		this.namedJdbcTemplate = new NamedParameterJdbcTemplate(
				jdbcTemplate.getDataSource());
	}

	@Override
	public boolean isExit(String account, int type) {
		String sql = "";
		// 判断账号类型
		switch (type) {
		case Utils.TEL:
			// 电话
			sql = "select count(*) from user_t where tel = ?";
			break;
		case Utils.EMAIL:
			sql = "select count(*) from user_t where email = ?";
			break;
		case Utils.PEN_NAME:
			sql = "select count(*) from user_t where pen_name = ?";
			break;
		default:
			return false;
		}
		@SuppressWarnings("deprecation")
		int num = jdbcTemplate.queryForInt(sql, account);
		return num > 0 ? true : false;
	}

	@Override
	public boolean addOneUser(String account, String pwd, int type) {
		// TODO 插入一条记录
		UserMod model = new UserMod();
		String sql1 = "insert into user_t(pen_name,tel,email,password,url)"
				+ "values(:pen_name,:tel,:email,:password,:url)";
		model.setPassword(Utils.md5Encode(pwd));
		// 判断账号类型
		switch (type) {
		case Utils.TEL:
			// 电话
			model.setTel(account);
			break;
		case Utils.EMAIL:
			model.setEmail(account);
			break;
		case Utils.PEN_NAME:
			model.setPen_name(account);
			break;
		default:
			return false;
		}
		GeneratedKeyHolder generatedKeyHolder = new GeneratedKeyHolder();
		int i = this.namedJdbcTemplate.update(sql1,
				new BeanPropertySqlParameterSource(model), generatedKeyHolder);
		return i > 0 ? true : false;
	}

	@Override
	public UserMod getOneUser(String account, String pwd, int type) {
		// TODO Auto-generated method stub
		String sql = "";
		// 判断账号类型
		switch (type) {
		case Utils.TEL:
			// 电话
			sql = "select * from user_t where tel = ? and password= ?";
			break;
		case Utils.EMAIL:
			sql = "select * from user_t where email = ? and password= ?";
			break;
		case Utils.PEN_NAME:
			sql = "select * from user_t where pen_name = ? and password= ?";
			break;
		default:
			return null;
		}
		List<UserMod> list = jdbcTemplate.query(sql, new Object[] { account,
				Utils.md5Encode(pwd) }, new BeanPropertyRowMapper<UserMod>(
				UserMod.class));
		return ListUtils.isNotEmpty(list) ? list.get(0) : null;
	}

	@Override
	public List<UserMod> getUserList(String keyword, int start, int num) {
		// TODO Auto-generated method stub
		String key = "%" + keyword + "%";
        String sql = "select * from user_t where pen_name like ? order by id desc"
                + " limit " + start + "," + num;
        List<UserMod> list = jdbcTemplate.query(sql, new Object[]
        { key }, new BeanPropertyRowMapper<UserMod>(UserMod.class));
        return list;
	}

	
	@Override
	public UserMod getUser(int id) {
		String sql = "select * from user_t where id = ?";
        List<UserMod> list = jdbcTemplate.query(sql, new Object[]
        { id }, new BeanPropertyRowMapper<UserMod>(UserMod.class));
        return list.get(0);
	}

	@Override
	public boolean updateUser(UserMod model) {
		String sql = "update user_t set pen_name=:pen_name,tel=:tel,email=:email,url=:url,money=:money "
                + "where id=:id";
        GeneratedKeyHolder generatedKeyHolder = new GeneratedKeyHolder();
        int num = this.namedJdbcTemplate.update(sql,
                new BeanPropertySqlParameterSource(model), generatedKeyHolder);
        return num > 0 ? true : false;
	}
}
