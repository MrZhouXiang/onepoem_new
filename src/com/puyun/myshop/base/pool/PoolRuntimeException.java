package com.puyun.myshop.base.pool;

import com.iuvei.framework.exception.ZeroRuntimeException;


public class PoolRuntimeException extends ZeroRuntimeException{
	/**
	 * 
	 */
	private static final long serialVersionUID = 2388903777807038751L;

	public PoolRuntimeException(String message) {
		super(message);
	}

	public PoolRuntimeException(String message, Throwable cause) {
		super(message, cause);
	}
}
