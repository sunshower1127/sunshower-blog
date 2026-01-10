interface SiteConfig {
	site: string
	author: string
	title: string
	description: string
	lang: string
	ogLocale: string
	shareMessage: string
	paginationSize: number
}

export const siteConfig: SiteConfig = {
	site: 'https://sunshower-blog.netlify.app/', // Write here your website url
	author: 'Kim Sunwoo', // Site author
	title: "Sunshower's Blog", // Site title.
	description: 'A blog about my life and my thoughts.', // Description to display in the meta tags
	lang: 'ko-KR',
	ogLocale: 'ko_KR',
	shareMessage: 'Share this post', // Message to share a post on social media
	paginationSize: 6 // Number of posts per page
}
