import os
from bs4 import BeautifulSoup

def remove_section_with_href(filename, section_class, href_pattern):
    """Removes the specified HTML section if its href contains the given pattern.

    Args:
        filename: The name of the HTML file.
        section_class: The class name of the section to remove.
        href_pattern: The pattern to match in the href attribute.
    """
    
    # Open the file and parse the HTML content
    with open(filename, 'r', encoding='utf-8') as f:
        soup = BeautifulSoup(f, 'html.parser')
    
    # Find all sections with the specified class
    sections = soup.find_all('section', class_=section_class)
    for section in sections:
        # Check if any <a> tag within the section contains the href pattern
        for a_tag in section.find_all('a', href=True):
            if href_pattern in a_tag['href']:
                section.decompose()  # Remove the entire section
                break  # Stop after finding the first match
    
    # Write the modified HTML back to the file, preserving the structure
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(soup.prettify(formatter="html"))

# Replace 'display-7' and 'mobi' with your actual values
section_class = 'display-7'
href_pattern = 'mobi'

# Process all HTML files in the current directory
for filename in os.listdir('.'):
    if filename.endswith('.html'):
        remove_section_with_href(filename, section_class, href_pattern)
