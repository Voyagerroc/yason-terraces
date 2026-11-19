# Security reporting

Report suspected vulnerabilities privately to
[erol@voyagerroctechnologies.com](mailto:erol@voyagerroctechnologies.com).
Include the affected URL or commit, deployment type (Pages or Nginx), impact
and a minimal reproduction without personal data. Do not post credentials,
private booking information or other people's records in public issues.
No response or remediation deadline is guaranteed.

The current `main` source is maintained. Static checks inspect source
invariants; the Docker job verifies a container can serve the page. Neither
establishes a production security grade, live provider configuration or legal
compliance. A GitHub Pages preview does not run `nginx.conf.template`.

Keep any future analytics, enquiry or reservation data flow explicit and
review its notice, retention and provider boundaries before enabling it.
