# Configuration file for the Sphinx documentation builder.
#
# For the full list of built-in configuration values, see the documentation:
# https://www.sphinx-doc.org/en/master/usage/configuration.html

# -- Project information -----------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#project-information

project = 'PowerButtons'
copyright = '2023, Carlos A. <https://github.com/dealfonso>'
author = 'Carlos A. <https://github.com/dealfonso>'
version = '2.0'
release = '2.0.1'

# -- General configuration ---------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#general-configuration

#extensions = [
#	"sphinx_rtd_theme"
#]

extensions = [
    'sphinx.ext.duration',
    'sphinx.ext.doctest',
    'sphinx.ext.autodoc',
    'sphinx.ext.autosummary',
    'sphinx.ext.intersphinx',
    'sphinx_rtd_theme',
]

intersphinx_mapping = {
    'python': ('https://docs.python.org/3/', None),
    'sphinx': ('https://www.sphinx-doc.org/en/master/', None),
}
intersphinx_disabled_domains = ['std']

templates_path = ['_templates']
exclude_patterns = ['_build', 'Thumbs.db', '.DS_Store']

# -- Options for HTML output -------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#options-for-html-output

#html_theme = 'alabaster'
html_theme = "sphinx_rtd_theme"
html_static_path = ['_static']

# -- Options for EPUB output
epub_show_urls = 'footnote'

# Place in docs/_ext
# 
# Add to conf.py:
#   sys.path.append(os.path.abspath("./_ext")
#   extensions = [
#       # ...
#       'fontawesome',
#   ]
#


# Make sure that the fontawesome CSS file is included in the build
html_css_files = [
    "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css"
]

from docutils.nodes import emphasis
from docutils.parsers.rst.roles import set_classes

def fa(role, rawtext, text, lineno, inliner, options={}, content=[]):
    """Adds an `:fa:` role to docs to insert an icon from Font Awesome.

    The extension assumes that fontawesome assets are already included in the
    document build, for example by using the `sphinx_rtd_theme` theme, which
    uses Font Awesome as well.
    """
    classes = ["fa"]
    for x in text.split(" "):
        print(x)
        if x.startswith("fa-") or x.startswith("fas-") or x.startswith("far-") or x.startswith("fal-") or x.startswith("fab-"):
            classes.append(x)
        else:
            classes.append('fa-{}'.format(x))

    options.update({'classes': classes})
    set_classes(options)
    node = emphasis(**options)
    return [node], []

def setup(app):
    app.add_role('fa', fa)
    return {'version': "0.1"}