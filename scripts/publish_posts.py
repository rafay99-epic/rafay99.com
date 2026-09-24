import os
import sys
from pathlib import Path
from datetime import datetime, timezone, date
import yaml
import re
import logging
from typing import List, Dict, Optional, Tuple

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - [%(filename)s:%(lineno)d] - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)

BLOG_CONTENT_DIR = Path("src/content/blog")

def extract_frontmatter(content: str, file_name: str):
    """
    Extracts YAML frontmatter from Markdown content.
    Returns (metadata_dict, body_content, original_yaml_str) on success,
    or (None, None, None) on failure. Logs warnings/errors.
    """
    match = re.match(r'^---\s*\n(.*?)\n---\s*\n', content, re.DOTALL)
    if not match:
        logging.debug(f"No YAML frontmatter delimiters found in {file_name}")
        return None, None, None

    yaml_content_str = match.group(1)
    body_content = content[match.end():]

    try:
        metadata = yaml.safe_load(yaml_content_str)
        if isinstance(metadata, dict):
            logging.debug(f"Successfully extracted metadata for {file_name}")
            return metadata, body_content, yaml_content_str
        else:
            logging.warning(f"Frontmatter in {file_name} parsed but is not a dictionary (type: {type(metadata)}). Skipping file.")
            return None, None, None
    except yaml.YAMLError as e:
        logging.error(f"Error parsing YAML frontmatter in {file_name}: {e}. Skipping file.")
        return None, None, None
    except Exception as e:
        logging.error(f"Unexpected error parsing YAML in {file_name}: {e}. Skipping file.")
        return None, None, None

def generate_seo_keywords(title: str, tags: List[str], content: str) -> List[str]:
    """Generate SEO keywords based on title, tags, and content."""
    keywords = []
    
    if tags:
        keywords.extend(tags)
    
    title_words = re.findall(r'\b\w+\b', title.lower())
    tech_keywords = ['python', 'javascript', 'react', 'astro', 'typescript', 'node', 'web', 'development', 
                    'coding', 'programming', 'tutorial', 'guide', 'tips', 'tricks', 'best', 'practices',
                    'automation', 'script', 'api', 'database', 'linux', 'arch', 'ubuntu', 'debian',
                    'docker', 'git', 'github', 'deployment', 'performance', 'optimization', 'seo']
    
    for word in title_words:
        if word in tech_keywords and word not in keywords:
            keywords.append(word)
    
    if 'python' in keywords:
        keywords.append('programming')
    if 'javascript' in keywords or 'js' in keywords:
        keywords.append('web development')
    if 'react' in keywords:
        keywords.append('frontend')
    if 'astro' in keywords:
        keywords.append('static site')
    
    return keywords[:10]

def generate_excerpt(content: str, max_length: int = 160) -> str:
    """Generate excerpt from content."""
    clean_content = re.sub(r'!\[.*?\]\(.*?\)', '', content)
    clean_content = re.sub(r'\[.*?\]\(.*?\)', '', clean_content)
    clean_content = re.sub(r'#{1,6}\s*', '', clean_content)
    clean_content = re.sub(r'\*\*(.*?)\*\*', r'\1', clean_content)
    clean_content = re.sub(r'\*(.*?)\*', r'\1', clean_content)
    clean_content = re.sub(r'`(.*?)`', r'\1', clean_content)
    clean_content = re.sub(r'\n+', ' ', clean_content)
    clean_content = re.sub(r'\s+', ' ', clean_content).strip()
    
    sentences = re.split(r'[.!?]', clean_content)
    first_sentence = sentences[0].strip() if sentences else clean_content
    
    if len(first_sentence) <= max_length:
        return first_sentence
    
    return first_sentence[:max_length-3] + "..."

def generate_canonical_url(title: str) -> str:
    """Generate canonical URL from title."""
    slug = re.sub(r'[^\w\s-]', '', title.lower())
    slug = re.sub(r'[-\s]+', '-', slug)
    slug = slug.strip('-')
    return f"/blog/{slug}"

def generate_alt_text_suggestion(image_path: str, content_context: str) -> str:
    """Generate alt text suggestions based on image path and content context."""
    base_name = os.path.basename(image_path)
    name_without_ext = os.path.splitext(base_name)[0]
    
    clean_name = name_without_ext.replace('-', ' ').replace('_', ' ').replace('.', ' ')
    
    patterns = {
        'screenshot': 'Screenshot showing',
        'ssd_contactform_error': 'Contact form error message showing validation failure',
        'speed_result': 'Website performance results showing improved speed scores',
        'kiro_interface': 'Kiro code editor interface showing modern UI',
        'review_screen': 'Code review screen in Kiro showing diff view',
        'proof': 'Automated file management script output showing successful organization',
        'my_driver': 'NVIDIA driver installation interface on Arch Linux',
        'Screenshot 2025-02-16 182018': 'Screenshot of contact form interface with form fields',
        'interface': 'User interface showing',
        'result': 'Results showing',
        'error': 'Error message displaying',
        'success': 'Success message showing',
        'code': 'Code snippet showing',
        'terminal': 'Terminal output showing',
        'browser': 'Browser window showing',
        'mobile': 'Mobile interface showing',
        'desktop': 'Desktop interface showing'
    }
    
    for pattern, suggestion in patterns.items():
        if pattern.lower() in name_without_ext.lower():
            return suggestion
    
    if content_context:
        lines = content_context.split('\n')
        for line in lines:
            if line.strip().startswith('#'):
                heading = re.sub(r'^#+\s*', '', line.strip())
                return f"Image related to: {heading}"
    
    return f"Image showing {clean_name}"

def add_alt_text_to_content(content: str) -> Tuple[str, int]:
    """Add alt text to images in content. Returns (updated_content, images_updated)."""
    images_updated = 0
    
    markdown_pattern = r'!\[\]\(([^)]+)\)'
    
    def replace_markdown(match):
        nonlocal images_updated
        image_path = match.group(1)
        alt_text = generate_alt_text_suggestion(image_path, content)
        images_updated += 1
        logging.debug(f"Added alt text to markdown image: {image_path}")
        return f'![{alt_text}]({image_path})'
    
    content = re.sub(markdown_pattern, replace_markdown, content)
    
    html_pattern = r'<img([^>]+src=["\']([^"\']+)["\'][^>]*?)>'
    
    def replace_html(match):
        nonlocal images_updated
        img_attrs = match.group(1)
        image_path = match.group(2)
        
        if 'alt=' in img_attrs:
            logging.debug(f"HTML image already has alt text: {image_path}")
            return match.group(0)
        
        alt_text = generate_alt_text_suggestion(image_path, content)
        images_updated += 1
        logging.debug(f"Added alt text to HTML image: {image_path}")
        return f'<img{img_attrs} alt="{alt_text}">'
    
    content = re.sub(html_pattern, replace_html, content)
    
    return content, images_updated

def enhance_seo_metadata(metadata: Dict, body: str, title: str) -> Tuple[Dict, bool]:
    """Enhance SEO metadata if missing. Returns (updated_metadata, was_updated)."""
    updated = False
    enhanced_metadata = metadata.copy()
    
    if not enhanced_metadata.get('keywords'):
        tags = enhanced_metadata.get('tags', [])
        keywords = generate_seo_keywords(title, tags, body)
        enhanced_metadata['keywords'] = keywords
        updated = True
        logging.info(f"Added keywords: {keywords}")
    else:
        logging.debug(f"Keywords already exist: {enhanced_metadata.get('keywords')}")
    
    if not enhanced_metadata.get('excerpt'):
        excerpt = generate_excerpt(body)
        enhanced_metadata['excerpt'] = excerpt
        updated = True
        logging.info(f"Added excerpt: {excerpt[:50]}...")
    else:
        logging.debug(f"Excerpt already exists: {enhanced_metadata.get('excerpt')[:50]}...")
    
    if not enhanced_metadata.get('canonicalUrl'):
        canonical_url = generate_canonical_url(title)
        enhanced_metadata['canonicalUrl'] = canonical_url
        updated = True
        logging.info(f"Added canonical URL: {canonical_url}")
    else:
        logging.debug(f"Canonical URL already exists: {enhanced_metadata.get('canonicalUrl')}")
    
    if 'featured' not in enhanced_metadata:
        enhanced_metadata['featured'] = False
        updated = True
        logging.info("Set featured to false")
    else:
        logging.debug(f"Featured already exists: {enhanced_metadata.get('featured')}")
    
    return enhanced_metadata, updated

def update_yaml_frontmatter(original_yaml: str, metadata: Dict) -> str:
    """Update YAML frontmatter with new metadata, preserving original formatting."""
    try:
        existing_metadata = yaml.safe_load(original_yaml)
        if not isinstance(existing_metadata, dict):
            return original_yaml
        
        fields_to_add = {}
        for key, value in metadata.items():
            if key not in existing_metadata:
                fields_to_add[key] = value
                logging.debug(f"Will add missing field '{key}' to frontmatter")
            else:
                logging.debug(f"Field '{key}' already exists, skipping")
        
        if not fields_to_add:
            return original_yaml
        
        lines = original_yaml.split('\n')
        
        last_content_line = -1
        for i, line in enumerate(lines):
            if line.strip() == '---':
                last_content_line = i - 1
                break
        
        if last_content_line < 0:
            return original_yaml
        
        new_lines = lines[:last_content_line + 1]
        
        for key, value in fields_to_add.items():
            if isinstance(value, list):
                new_lines.append(f"{key}:")
                for item in value:
                    new_lines.append(f"  - {item}")
            else:
                new_lines.append(f"{key}: {value}")
        
        new_lines.extend(lines[last_content_line + 1:])
        
        return '\n'.join(new_lines)
    except Exception as e:
        logging.error(f"Error updating YAML frontmatter: {e}")
        return original_yaml

def publish_post_if_ready(file_path: Path):
    """
    Checks pubDate and updates draft status if needed for a single file.
    Also enhances SEO metadata and adds alt text to images.
    Returns True if the file was updated, False otherwise.
    """
    made_change = False
    file_name = file_path.name

    try:
        logging.debug(f"Processing file: {file_name}")
        content = file_path.read_text(encoding='utf-8')

        metadata, body, original_yaml = extract_frontmatter(content, file_name)

        if metadata is None:
            return False

        is_draft = metadata.get('draft')
        pub_date_value = metadata.get('pubDate')
        title = metadata.get('title', '')

        logging.debug(f"File: {file_name}, Draft Status: {is_draft}, PubDate Value: {pub_date_value}")

        if is_draft is True:
            if pub_date_value is not None:
                pub_date_dt = None
                try:
                    if isinstance(pub_date_value, datetime):
                        pub_date_dt = pub_date_value
                        if pub_date_dt.tzinfo is None or pub_date_dt.tzinfo.utcoffset(pub_date_dt) is None:
                            pub_date_dt = pub_date_dt.replace(tzinfo=timezone.utc)

                    elif isinstance(pub_date_value, date) and not isinstance(pub_date_value, datetime):
                         pub_date_dt = datetime(pub_date_value.year, pub_date_value.month, pub_date_value.day, 0, 0, 0, tzinfo=timezone.utc)

                    elif isinstance(pub_date_value, str):
                        parsed_date_str = pub_date_value.replace('Z', '+00:00')
                        pub_date_dt = datetime.fromisoformat(parsed_date_str)
                    else:
                        logging.warning(f"Unexpected type for pubDate in {file_name}: {type(pub_date_value)}. Cannot compare date.")

                    if pub_date_dt:
                        now_utc = datetime.now(timezone.utc)

                        if pub_date_dt <= now_utc:
                            logging.info(f"Publishing {file_name} (pubDate: {pub_date_value})")

                            enhanced_metadata, seo_updated = enhance_seo_metadata(metadata, body, title)
                            
                            updated_body, images_updated = add_alt_text_to_content(body)
                            
                            new_yaml = re.sub(r"^\s*draft:\s*true\s*$", "draft: false", original_yaml, flags=re.MULTILINE | re.IGNORECASE)
                            if new_yaml == original_yaml:
                                temp_yaml = original_yaml.replace('draft: true', 'draft: false', 1)
                                new_yaml = temp_yaml.replace('draft: True', 'draft: false', 1)

                            if seo_updated:
                                new_yaml = update_yaml_frontmatter(new_yaml, enhanced_metadata)

                            if new_yaml != original_yaml or updated_body != body:
                                try:
                                    new_content = f"---\n{new_yaml.strip()}\n---\n{updated_body}"
                                    file_path.write_text(new_content, encoding='utf-8')
                                    logging.info(f"Successfully updated {file_name}")
                                    if seo_updated:
                                        logging.info(f"  - Enhanced SEO metadata")
                                    if images_updated > 0:
                                        logging.info(f"  - Added alt text to {images_updated} images")
                                    logging.info(f"  - Changed draft status to false")
                                    made_change = True
                                except IOError as write_err:
                                     logging.error(f"Failed to write updated content to {file_name}: {write_err}")
                                except Exception as write_ex:
                                     logging.error(f"Unexpected error writing updated content to {file_name}: {write_ex}")
                            else:
                                 logging.warning(f"Could not find/replace 'draft: true' in {file_name}. Already false or formatted unusually?")
                        else:
                             logging.info(f"Skipping {file_name}: Publication date ({pub_date_value}) is in the future.")

                except ValueError as e:
                    logging.warning(f"Could not process pubDate value '{pub_date_value}' in {file_name}: {e}. Skipping date check.")
                except Exception as e:
                    logging.error(f"Unexpected error during date processing for {file_name}: {e}")
            else:
                 logging.warning(f"Skipping {file_name}: Draft is true, but 'pubDate' key is missing.")
        else:
            logging.info(f"Enhancing SEO and alt text for published post: {file_name}")
            
            enhanced_metadata, seo_updated = enhance_seo_metadata(metadata, body, title)
            
            updated_body, images_updated = add_alt_text_to_content(body)
            
            if seo_updated or images_updated > 0:
                new_yaml = original_yaml
                if seo_updated:
                    new_yaml = update_yaml_frontmatter(original_yaml, enhanced_metadata)

                try:
                    new_content = f"---\n{new_yaml.strip()}\n---\n{updated_body}"
                    file_path.write_text(new_content, encoding='utf-8')
                    logging.info(f"Successfully enhanced {file_name}")
                    if seo_updated:
                        logging.info(f"  - Enhanced SEO metadata")
                    if images_updated > 0:
                        logging.info(f"  - Added alt text to {images_updated} images")
                    made_change = True
                except IOError as write_err:
                     logging.error(f"Failed to write updated content to {file_name}: {write_err}")
                except Exception as write_ex:
                     logging.error(f"Unexpected error writing updated content to {file_name}: {write_ex}")

    except FileNotFoundError:
        logging.error(f"File vanished before processing: {file_name}")
    except PermissionError as pe:
        logging.error(f"Permission error reading file {file_name}: {pe}")
    except IOError as e:
        logging.error(f"IOError reading file {file_name}: {e}")
    except UnicodeDecodeError as ude:
        logging.error(f"Encoding error reading file {file_name}. Ensure it's UTF-8: {ude}")
    except Exception as e:
        logging.exception(f"Unexpected error processing file {file_name}: {e}")

    return made_change

def main():
    """Finds posts and attempts to publish them with SEO enhancements."""
    logging.info("Starting enhanced auto-publish script...")
    total_changes = 0

    if not BLOG_CONTENT_DIR.is_dir():
        resolved_path = BLOG_CONTENT_DIR.resolve()
        cwd = Path.cwd()
        logging.critical(f"Blog content directory not found at expected path: {BLOG_CONTENT_DIR}")
        logging.critical(f"Resolved path attempted: {resolved_path}")
        logging.critical(f"Current working directory: {cwd}")
        logging.critical("Ensure the script is run from the repository root or BLOG_CONTENT_DIR is correct.")
        sys.exit(1)

    logging.info(f"Checking posts in directory: {BLOG_CONTENT_DIR}")

    try:
        files_to_check = list(BLOG_CONTENT_DIR.glob("*.md")) + list(BLOG_CONTENT_DIR.glob("*.mdx"))
        logging.info(f"Found {len(files_to_check)} potential post files (.md, .mdx).")

        processed_files = 0
        for file_path in files_to_check:
            if file_path.is_file():
                if publish_post_if_ready(file_path):
                    total_changes += 1
                processed_files += 1
            else:
                 logging.warning(f"Path found by glob is not a file (skipped): {file_path}")

        logging.info(f"Processed {processed_files} files.")

    except Exception as e:
        logging.exception(f"An unexpected error occurred during file processing loop: {e}")

    logging.info("-" * 20)
    if total_changes > 0:
        logging.info(f"Script finished. {total_changes} post(s) were updated with SEO enhancements and alt text.")
    else:
        logging.info("Script finished. No posts needed publishing or updating.")
    logging.info("-" * 20)

if __name__ == "__main__":
    main()