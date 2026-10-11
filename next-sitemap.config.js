/** @type {import('next-sitemap').IConfig} */

// 로그인/관리자 전용 경로는 sitemap에서 빼고 robots.txt로 크롤링을 막는다
const PRIVATE_PATHS = ['/admins', '/dashboard', '/trial/dashboard', '/login', '/unauthorized'];

module.exports = {
    siteUrl: 'https://www.toolz.co.kr/',
    generateRobotsTxt: true,
    sitemapSize: 5000,
    changefreq: 'daily',
    priority: 1,
    exclude: PRIVATE_PATHS.flatMap((path) => [path, `${path}/*`]),
    robotsTxtOptions: {
        policies: [
            {
                userAgent: '*',
                allow: '/',
                disallow: PRIVATE_PATHS,
            },
        ],
    },
};
