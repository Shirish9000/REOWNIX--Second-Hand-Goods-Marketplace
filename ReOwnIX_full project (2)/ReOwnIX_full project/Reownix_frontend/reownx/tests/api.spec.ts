import { test, expect } from '@playwright/test';

test('Get Products API', async ({ request }) => {

    const response = await request.get(
        'http://localhost:8080/api/products'
    );

    expect(response.ok()).toBeTruthy();

    const body = await response.json();

    console.log(body);

});