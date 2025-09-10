# Open Graph Setup Guide

## 🎯 Goal
Ensure that when campaign/project links are shared (WhatsApp, Slack, LinkedIn, email), the preview shows the **Netcore × HDFC Omnichannel Project** image.

## 📁 Files Created

### 1. **Open Graph Image**
- **Location**: `/public/og/omnichannel-project.png`
- **URL**: `https://netcorehdfc.netlify.app/og/omnichannel-project.png`
- **Dimensions**: 1200×630px (optimal for social sharing)
- **Format**: PNG for maximum compatibility

### 2. **Alternative Formats**
- **SVG Version**: `/public/og/omnichannel-project.svg` (scalable)
- **HTML Template**: `/public/og/omnichannel-project.html` (for regeneration)

## 🔧 Meta Tags Configuration

### Open Graph Tags
```html
<meta property="og:title" content="Netcore × HDFC Omnichannel Project" />
<meta property="og:description" content="Customer engagement at scale through an integrated omnichannel campaign platform." />
<meta property="og:type" content="website" />
<meta property="og:url" content="https://netcorehdfc.netlify.app/" />
<meta property="og:image" content="https://netcorehdfc.netlify.app/og/omnichannel-project.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="Netcore × HDFC Omnichannel Project" />
<meta property="og:site_name" content="Netcore × HDFC" />
```

### Twitter Card Tags
```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Netcore × HDFC Omnichannel Project" />
<meta name="twitter:description" content="Customer engagement at scale through an integrated omnichannel campaign platform." />
<meta name="twitter:image" content="https://netcorehdfc.netlify.app/og/omnichannel-project.png" />
<meta name="twitter:image:alt" content="Netcore × HDFC Omnichannel Project" />
```

## 🌐 SPA Configuration

### Netlify _redirects
```
/*    /index.html   200
```
This ensures all routes serve the same meta tags for consistent social sharing.

## 🎨 Image Design Specifications

### Visual Elements
- **Background**: Blue gradient (#1E4078 to #2B5AA0)
- **Netcore Logo**: Orange "netco" + white "re" (#FF6700)
- **HDFC Logo**: Red square with white center and red dot
- **Typography**: Bold Arial, large sizes for readability
- **Layout**: Centered, professional spacing

### Dimensions & Format
- **Size**: 1200×630px (Facebook/LinkedIn optimal)
- **Aspect Ratio**: 1.91:1 (recommended by social platforms)
- **Format**: PNG for compatibility, SVG for scalability
- **File Size**: Optimized for fast loading

## 📱 Platform Support

### Supported Platforms
- ✅ **Facebook**: Open Graph tags
- ✅ **LinkedIn**: Open Graph tags
- ✅ **Twitter**: Twitter Card tags
- ✅ **WhatsApp**: Open Graph tags
- ✅ **Slack**: Open Graph tags
- ✅ **Discord**: Open Graph tags
- ✅ **Telegram**: Open Graph tags

### Preview Behavior
- **Title**: "Netcore × HDFC Omnichannel Project"
- **Description**: "Customer engagement at scale through an integrated omnichannel campaign platform."
- **Image**: Branded project logo with blue background
- **URL**: Clean domain display

## 🔍 Testing & Validation

### Social Media Debuggers
Test your links with these tools:

1. **Facebook Sharing Debugger**
   - URL: https://developers.facebook.com/tools/debug/
   - Test URL: `https://netcorehdfc.netlify.app/`

2. **Twitter Card Validator**
   - URL: https://cards-dev.twitter.com/validator
   - Test URL: `https://netcorehdfc.netlify.app/`

3. **LinkedIn Post Inspector**
   - URL: https://www.linkedin.com/post-inspector/
   - Test URL: `https://netcorehdfc.netlify.app/`

4. **WhatsApp Link Preview**
   - Send link in WhatsApp to test preview
   - Should show image, title, and description

### Manual Testing Steps
1. **Clear Cache**: Use debuggers to refresh cached data
2. **Test Multiple URLs**: Test root and deep links
3. **Verify Image**: Ensure image loads correctly
4. **Check Text**: Verify title and description display
5. **Mobile Test**: Check previews on mobile devices

## 🚀 Deployment Notes

### Netlify Configuration
- ✅ **SPA Routing**: Configured via `_redirects`
- ✅ **Static Assets**: Images served from `/public/og/`
- ✅ **CDN**: Automatic caching and global distribution
- ✅ **HTTPS**: Secure URLs for social sharing

### Performance Optimization
- **Image Compression**: PNG optimized for web
- **CDN Delivery**: Fast loading via Netlify CDN
- **Caching**: Proper cache headers for social crawlers
- **Fallbacks**: Multiple image formats available

## 🔧 Maintenance

### Updating the Image
1. **Edit Template**: Modify `/public/og/omnichannel-project.html`
2. **Generate PNG**: Convert HTML to PNG (1200×630)
3. **Replace File**: Update `/public/og/omnichannel-project.png`
4. **Clear Cache**: Use social debuggers to refresh
5. **Test**: Verify across platforms

### Monitoring
- **Regular Testing**: Monthly checks with social debuggers
- **Performance**: Monitor image loading times
- **Analytics**: Track social sharing metrics
- **Updates**: Keep branding consistent with changes

## 📋 Checklist

✅ **Image Created**: 1200×630 PNG in `/public/og/`  
✅ **Meta Tags**: Open Graph and Twitter Card configured  
✅ **SPA Routing**: Netlify _redirects configured  
✅ **URLs**: Absolute URLs for social sharing  
✅ **Testing**: Ready for social media debuggers  
✅ **Documentation**: Complete setup guide  

## 🎯 Expected Results

When sharing `https://netcorehdfc.netlify.app/` on:
- **WhatsApp**: Rich preview with project image
- **LinkedIn**: Professional card with branding
- **Twitter**: Large image card with description
- **Slack**: Expanded preview with image
- **Email**: Rich HTML preview (client dependent)

The preview will consistently show the Netcore × HDFC Omnichannel Project branding across all platforms! 🚀
