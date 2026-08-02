#!/usr/bin/env ruby
# frozen_string_literal: true

require 'yaml'

config = YAML.load_file('.coderabbit.yaml')
reviews = config.fetch('reviews')
auto_review = reviews.fetch('auto_review')
required_branches = ['^dev$', '^main$']
required_paths = ['openspec/**/*.md', 'README.md']

abort 'missing automatic review branch' unless required_branches.all? { |branch| auto_review.fetch('base_branches').include?(branch) }
abort 'draft reviews enabled' unless auto_review.fetch('drafts') == false
abort 'incremental review disabled' unless auto_review.fetch('auto_incremental_review') == true
abort 'incremental review pause enabled' unless auto_review.fetch('auto_pause_after_reviewed_commits') == 0
paths = reviews.fetch('path_instructions').map { |instruction| instruction.fetch('path') }
abort 'missing documentation path instruction' unless required_paths.all? { |path| paths.include?(path) }

puts 'CodeRabbit review-policy contract valid'
