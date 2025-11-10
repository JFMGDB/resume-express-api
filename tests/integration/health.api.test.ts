import request from 'supertest';
import app from '../../src/app';

describe('Health API (Integration)', () => {
  describe('GET /api/v1/health', () => {
    it('should return 200 OK with health status', async () => {
      const response = await request(app).get('/api/v1/health');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
      expect(typeof response.body.uptime).toBe('number');
    });
  });
});

