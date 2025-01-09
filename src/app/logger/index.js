"use client";

const storeLogs = (newLog) => {
  // Only run on client side
  if (typeof window === 'undefined') return;
  
  try {
    const existingLogs = JSON.parse(localStorage.getItem('app_logs') || '[]');
    const updatedLogs = [
      {
        ...newLog,
        timestamp: new Date().toISOString(),
      },
      ...existingLogs,
    ].slice(0, 1000);
    localStorage.setItem('app_logs', JSON.stringify(updatedLogs));
  } catch (error) {
    console.error('Failed to store log:', error);
  }
};

const createLogger = (context) => {
  const logger = {
    info: (data, message) => {
      const logEntry = {
        level: 'info',
        context,
        message,
        data,
      };
      if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
        console.log(`[${context}] INFO:`, message, data);
      }
      storeLogs(logEntry);
    },
    error: (data, message) => {
      const logEntry = {
        level: 'error',
        context,
        message,
        data,
      };
      if (typeof window !== 'undefined') {
        console.error(`[${context}] ERROR:`, message, data);
      }
      storeLogs(logEntry);
    },
    warn: (data, message) => {
      const logEntry = {
        level: 'warn',
        context,
        message,
        data,
      };
      if (typeof window !== 'undefined') {
        console.warn(`[${context}] WARN:`, message, data);
      }
      storeLogs(logEntry);
    },
    debug: (data, message) => {
      const logEntry = {
        level: 'debug',
        context,
        message,
        data,
      };
      if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
        console.debug(`[${context}] DEBUG:`, message, data);
        storeLogs(logEntry);
      }
    },
    child: (childContext) => {
      return createLogger(`${context}:${childContext}`);
    }
  };
  
  return logger;
};

const rootLogger = createLogger('app');
export default rootLogger; 