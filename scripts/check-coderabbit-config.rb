#!/usr/bin/env ruby
# frozen_string_literal: true

require 'yaml'

config = YAML.load_file(ENV.fetch('CODERABBIT_CONFIG', '.coderabbit.yaml'))
reviews = config.fetch('reviews')
auto_review = reviews.fetch('auto_review')
required_branches = ['^dev$', '^main$']
required_path_instructions = {
  'js/**/*.js' => ['deterministic, static-first progression', 'browser-storage migration'],
  'maestros-secret.html' => ['semantic controls', 'keyboard operation', 'responsive interaction surfaces'],
  'service-worker.js' => ['cache changes as release compatibility work', 'same-origin GET precache', 'optional AI traffic'],
  'workers/**/*.js' => ['untrusted optional guidance boundary', 'strict request validation', 'authored fallback parity'],
  'openspec/**/*.md' => ['OpenSpec as the source of truth', 'TDD evidence', 'README claims'],
  'tests/**/*.js' => ['deterministic, behavior-focused coverage', 'missing accessibility coverage'],
  '.github/workflows/**' => ['workflow safety', 'least-privilege permissions', 'action pinning'],
  'README.md' => ['player-facing and engineering claims', 'static-first/privacy boundary', 'validation commands']
}

abort 'missing automatic review branch' unless required_branches.all? { |branch| auto_review.fetch('base_branches').include?(branch) }
abort 'draft reviews enabled' unless auto_review.fetch('drafts') == false
abort 'automatic review disabled' unless auto_review.fetch('enabled') == true
abort 'incremental review disabled' unless auto_review.fetch('auto_incremental_review') == true
abort 'incremental review pause enabled' unless auto_review.fetch('auto_pause_after_reviewed_commits') == 0
path_instructions = reviews.fetch('path_instructions').each_with_object({}) do |instruction, indexed|
  path = instruction.fetch('path')
  text = instruction.fetch('instructions')
  abort "empty path instruction for #{path}" if text.strip.empty?
  indexed[path] = text
end
required_path_instructions.each do |path, required_fragments|
  text = path_instructions[path]
  abort "missing path instruction for #{path}" unless text
  abort "missing required instruction text for #{path}" unless required_fragments.all? { |fragment| text.include?(fragment) }
end

puts 'CodeRabbit review-policy contract valid'
