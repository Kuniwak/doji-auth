#! /usr/bin/env ruby
# Absolute path of directory including this script
SCRIPT_DIR_PATH = File.dirname(File.expand_path(__FILE__))

CLOSURE_STYLESHEETS_PATH = "/opt/closure-stylesheets/closure-stylesheets-20111230.jar"

CSS_PATH = "#{SCRIPT_DIR_PATH}/css"

OUTPUT_FILE = "#{CSS_PATH}/style.min.css"

INPUT_FILES = [
	"#{CSS_PATH}/style.gss"
].join(' ')

CMD = "java -jar #{CLOSURE_STYLESHEETS_PATH} --output-file #{OUTPUT_FILE} #{INPUT_FILES}"

puts "#{CMD}"
puts `#{CMD}`
