package com.puyun.myshop.daoImpl;

import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;

import com.puyun.myshop.dao.AppDao;
import com.puyun.myshop.entity.PoemMod;

/**
 * 一首小诗App接口实现类
 */
public class AppDaoImpl extends BaseDaoImpl implements AppDao {
	private JdbcTemplate jdbcTemplate;

	private NamedParameterJdbcTemplate namedJdbcTemplate;

	private static final Logger logger = Logger.getLogger(AppDaoImpl.class);

	public JdbcTemplate getJdbcTemplate() {
		return this.jdbcTemplate;
	}

	public void setJdbcTemplate(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
		this.namedJdbcTemplate = new NamedParameterJdbcTemplate(
				jdbcTemplate.getDataSource());
	}
	

	@Override
	public List<PoemMod> getPoemList(int id, int size) {
		// TODO Auto-generated method stub
		String sql = "select * from poem_t";
//		List<PoemMod> list = jdbcTemplate
//				.queryForList(sql, null, PoemMod.class);
		List<PoemMod> list = jdbcTemplate.query(sql,
				new BeanPropertyRowMapper<PoemMod>(PoemMod.class));
		return list;
	}
}
