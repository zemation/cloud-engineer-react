import Navigation from "./Navigation"
import Footer from "./Footer"

const Projects = () => {
  return (
    <>
      <Navigation />
      <main>
      <section>
        <h1>Kubernetes</h1>
        <p>Recently I picked up three Dell Optiplex mini systems that have been configured for a Kubernetes cluster. This has provided me experience with setting up the cluster both via Kubernetes the Hard Way and using kubeadm init.  And also taught me much in the way planning ahead as I've worked out issues that arise on new clusters.</p>
        <p>The cluster is currently running Cilium for cluster networking as well as kube-proxy replacement.  This has definitely taught me how to ensure that there are no remnants of calico or flannel as well as if kube-proxy is removed to enable kube-proxy replacement in cilium.</p>
        <p>I have installed Longhorn to manage pvc and storage.  Which I also learned that planning ahead for storage don't let linux set up default partition sizes as I let it create a 34Gb /home when there is only one user and it's not used for any kind of user files.</p>
        <p>Due to apparent difficulties with resizing xfs partitions I re-imaged these systems and specified the desired partition sizes and the cluster is running again with Cilium for the CNI and Longhorn again for the storage.</p>   
        
      </section>
      <section>
        <h1>Prometheus / Grafana</h1>
        <p>Running Prometheus / Grafana after installing with helm and ensure it's running properly on the given storage solution.  This includes installing the blackbox-exporter so I can monitor this and other websites.  </p>
      </section>
      <section>
        <h1>Jenkins</h1>
        <p>Going to have it run on the Kubernetes cluster and will be used for understanding how to set up deployments with webhooks to update live websites after a pr is sent to git.</p>
      </section>
      <section>
        <h1>Cloud-Master.io</h1>
        <p>Passion project to provide a website that will also be built while learning react.  The idea behind it is to provide a hub for people to find resources to help learn topics and training for computer industry certifications. </p>

      </section>
      <section>
        <h1>LM Studio</h1>
        <p>While this goal is a little farther off, the goal is to experiment with AI models in order to provide a bot for cloud-master to help users not only find information but also directly talk with a AI model to help with troubleshooting items they may be working with.</p>
      
      </section>
      
    </main>
    <Footer/>
    </>
  )
}

export default Projects